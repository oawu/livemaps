<?php

/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 * @website     http://www.ioa.tw/
 */

class Step {
  public static $startTime;
  public static $nowSize;
  public static $size;
  public static $progress = array ();

  public static $uploadDirs = array ();
  public static $s3Files = array ();
  public static $localFiles = array ();
  
  public static function progress ($str, $c = 0) {
    $isStr = !is_numeric ($c);
    if (!isset (Step::$progress[$str])) Step::$progress[$str] = array ('c' => is_numeric ($c) && $c ? $c : 1, 'i' => 0);
    else Step::$progress[$str]['i'] += 1;

    if (is_numeric ($c) && $c) Step::$progress[$str]['c'] = $c;
    Step::$progress[$str]['i'] = Step::$progress[$str]['i'] >= Step::$progress[$str]['c'] || $isStr ? Step::$progress[$str]['c'] : Step::$progress[$str]['i'];
    
    preg_match_all('/(?P<c>[\x{4e00}-\x{9fa5}])/u', $str . ($isStr ? $c : ''), $matches);

    Step::$size = memory_get_usage () > Step::$size ? memory_get_usage () : Step::$size;
    $size = Step::memoryUnit (Step::$size - Step::$nowSize);
    $show = sprintf (' ' . self::color ('➜', 'W') . ' ' . self::color ($str . '(' . Step::$progress[$str]['i'] . '/' . Step::$progress[$str]['c'] . ')', 'g') . " - % 3d%% " . ($isStr ? '- ' . self::color ('完成！', 'C') : ''), Step::$progress[$str]['c'] ? ceil ((Step::$progress[$str]['i'] * 100) / Step::$progress[$str]['c']) : 100);
    echo sprintf ("\r% -" . (91 + count ($matches['c']) + ($isStr ? 12 : 0)) . "s" .  self::color (sprintf ('% 7s', $size[0]), 'W') . ' ' . $size[1] . " " . ($isStr ? "\n" : ''), $show, 10);
  }
  public static function start () {
    Step::$startTime = microtime (true);
    echo "\n" . str_repeat ('=', 80) . "\n";
    echo ' ' . self::color ('◎ 執行開始 ◎', 'P') . str_repeat (' ', 48) . '[' . self::color ('OA S3 Tools v1.0', 'y') . "]\n";
  }
  public static function end () {
    echo str_repeat ('=', 80) . "\n";
    echo ' ' . self::color ('◎ 執行結束 ◎', 'P') . "\n";
    echo str_repeat ('=', 80) . "\n";
  }
  public static function showUrl () {
    echo "\n";
    echo " " . self::color ('➜', 'R') . " " . self::color ('您的網址是', 'G') . "：" . self::color (PROTOCOL . BUCKET . '/' . NAME . '/', 'W') . "\n\n";
    echo str_repeat ('=', 80) . "\n";
  }
  public static function memoryUnit ($size) {
    $units = array ('B','KB','MB','GB','TB','PB');
    return array (@round ($size / pow (1024, ($i = floor (log ($size, 1024)))), 2), $units[$i]);
  }
  public static function usage () {
    echo str_repeat ('=', 80) . "\n";
    $size = Step::memoryUnit (memory_get_usage ());
    echo ' ' . self::color ('➜', 'W') . ' ' . self::color ('使用記憶體：', 'R') . '' . self::color ($size[0], 'W') . ' ' . $size[1] . "\n";
    echo str_repeat ('-', 80) . "\n";

    echo ' ' . self::color ('➜', 'W') . ' ' . self::color ('執行時間：', 'R') . '' . self::color (round (microtime (true) - Step::$startTime, 4), 'W') . ' 秒' . "\n";
  }
  public static function setUploadDirs ($args = array ()) {
    Step::$uploadDirs = $args;
  }

  public static function error ($errors = array ()) {
    echo "\n" . str_repeat ('=', 80) . "\n";
    echo " " . self::color ('➜', 'W') . ' ' . self::color ('有發生錯誤！', 'r') . "\n";
    echo $errors ? str_repeat ('-', 80) . "\n" . implode ("\n" . str_repeat ('-', 80) . "\n", $errors) . "\n" : "";
    echo str_repeat ('=', 80) . "\n";
    exit ();
  }
  public static function newLine ($char, $str = '', $c = 0) {
    echo str_repeat ($char, 80) . "\n";
    Step::$nowSize = Step::$size = memory_get_usage ();
    if ($str) Step::progress ($str, $c);
  }
  public static function init () {
    $paths = array (PATH);
    Step::newLine ('-', '初始化環境與變數', count ($paths));
    Step::progress ('初始化環境與變數', '完成！');
  }
  public static function initS3 ($access, $secret) {
    Step::newLine ('-', '初始化 S3 工具');
    
    try {
      if (!S3::init ($access, $secret)) throw new Exception ('初始化失敗！');
    } catch (Exception $e) { Step::error (array (' ' . $e->getMessage ())); }
    
    Step::progress ('初始化 S3 工具', '完成！');
  }
  public static function listLocalFiles () {
    Step::newLine ('-', '列出即將上傳所有檔案');

    $uploadDirs = array (); foreach (Step::$uploadDirs as $key => $value) array_push ($uploadDirs, array ('path' => PATH . $key, 'formats' => $value));

    Step::$localFiles = self::array2dTo1d (array_map (function ($uploadDir) {
        $files = array ();
        Step::mergeArrayRecursive (Step::directoryMap ($uploadDir['path']), $files, $uploadDir['path']);
        $files = array_filter ($files, function ($file) use ($uploadDir) { return in_array (pathinfo ($file, PATHINFO_EXTENSION), $uploadDir['formats']); });
        Step::progress ('列出即將上傳所有檔案');
        return array_map (function ($file) {
          
          if (MINIFY) {
            $bom = pack ('H*','EFBBBF');
            switch (pathinfo ($file, PATHINFO_EXTENSION)) {
              case 'html': Step::writeFile ($file, preg_replace ("/^$bom/", '', HTMLMin::minify (Step::readFile ($file)))); break;
              case 'css': Step::writeFile ($file, preg_replace ("/^$bom/", '', CSSMin::minify (Step::readFile ($file)))); break;
              case 'js': Step::writeFile ($file, preg_replace ("/^$bom/", '', JSMin::minify (Step::readFile ($file)))); break;
            }
          }

          return array ('path' => $file, 'md5' => md5_file ($file), 'uri' => preg_replace ('/^(' . preg_replace ('/\//', '\/', PATH) . ')/', '', $file));
        }, $files);
      }, $uploadDirs));

    Step::progress ('列出即將上傳所有檔案', '完成！');
  }
  public static function listS3Files () {
    try {
      Step::newLine ('-', '列出 S3 上所有檔案', count ($list = S3::getBucket (BUCKET, NAME)));
      Step::$s3Files = array_filter ($list, function ($file) {
        Step::progress ('列出 S3 上所有檔案');
        return preg_match ('/^' . NAME . '\//', $file['name']);
      });
    } catch (Exception $e) { Step::error (array (' ' . $e->getMessage ())); }

    Step::progress ('列出 S3 上所有檔案', '完成！');
  }
  public static function filterLocalFiles () {
    Step::newLine ('-', '過濾需要上傳檔案');

    $files = array_filter (Step::$localFiles, function ($file) {
      foreach (Step::$s3Files as $s3File)
        if (($s3File['name'] == (NAME . DIRECTORY_SEPARATOR . $file['uri'])) && ($s3File['hash'] == $file['md5']))
          return false;
      Step::progress ('過濾需要上傳檔案');
      return $file;
    });
    Step::progress ('過濾需要上傳檔案', '完成！');

    return $files;
  }
  public static function uploadLocalFiles ($files) {
    Step::newLine ('-', '上傳檔案', count ($files));
    
    if ($errors = array_filter (array_map (function ($file) {
        try {
          Step::progress ('上傳檔案');
          return !S3::putFile ($file['path'], BUCKET, NAME . DIRECTORY_SEPARATOR . $file['uri']) ? ' 檔案：' . $file['path'] : '';
        } catch (Exception $e) { Step::error (array (' ' . $e->getMessage ())); }
      }, $files))) Step::error ($errors);
    Step::progress ('上傳檔案', '完成！');
  }
  public static function filterS3Files () {
    Step::newLine ('-', '過濾需要刪除檔案');

    $files = array_filter (Step::$s3Files, function ($s3File) {
      foreach (Step::$localFiles as $localFile) if ($s3File['name'] == (NAME . DIRECTORY_SEPARATOR . $localFile['uri'])) return false;
      Step::progress ('過濾需要刪除檔案');
      return true;
    });

    Step::progress ('過濾需要刪除檔案', '完成！');

    return $files;
  }
  public static function deletwS3Files ($files) {
    Step::newLine ('-', '刪除 S3 上需要刪除的檔案', count ($files));

    if ($errors = array_filter (array_map (function ($file) {
        try {
          Step::progress ('刪除 S3 上需要刪除的檔案');
          return !S3::deleteObject (BUCKET, $file['name']) ? ' 檔案：' . $file['name'] : '';
        } catch (Exception $e) { Step::error (array (' ' . $e->getMessage ())); }
      }, $files))) Step::error ($errors);
    Step::progress ('刪除 S3 上需要刪除的檔案', '完成！');
  }
  public static function params ($params, $keys) {
    $ks = $return = $result = array ();

    if (!$params) return $return;
    if (!$keys) return $return;

    foreach ($keys as $key)
      if (is_array ($key)) foreach ($key as $k) array_push ($ks, $k);
      else  array_push ($ks, $key);

    $key = null;

    foreach ($params as $param)
      if (in_array ($param, $ks)) if (!isset ($result[$key = $param])) $result[$key] = array (); else ;
      else if (isset ($result[$key])) array_push ($result[$key], $param); else ;

    foreach ($keys as $key)
      if (is_array ($key))  foreach ($key as $k) if (isset ($result[$k])) $return[$key[0]] = isset ($return[$key[0]]) ? array_merge ($return[$key[0]], $result[$k]) : $result[$k]; else;
      else if (isset ($result[$key])) $return[$key] = isset ($return[$key]) ? array_merge ($return[$key], $result[$key]) : $result[$key]; else;

    return $return;
  }
  public static function directoryList ($sourceDir, $hidden = false) {
    if ($fp = @opendir ($sourceDir = rtrim ($sourceDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR)) {
      $filedata = array ();

      while (false !== ($file = readdir ($fp)))
        if (!(!trim ($file, '.') || (($hidden == false) && ($file[0] == '.'))))
          array_push ($filedata, $file);

      closedir ($fp);
      return $filedata;
    }
    return array ();
  }
  public static function directoryMap ($sourceDir, $directoryDepth = 0, $hidden = false) {
    if ($fp = @opendir ($sourceDir)) {
      $filedata = array ();
      $new_depth  = $directoryDepth - 1;
      $sourceDir = rtrim ($sourceDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

      while (false !== ($file = readdir ($fp))) {
        if (!trim ($file, '.') || (($hidden == false) && ($file[0] == '.')) || is_link ($file) || ($file == 'cmd')) continue;

        if ((($directoryDepth < 1) || ($new_depth > 0)) && @is_dir ($sourceDir . $file)) $filedata[$file] = Step::directoryMap ($sourceDir . $file . DIRECTORY_SEPARATOR, $new_depth, $hidden);
        else array_push ($filedata, $file);
      }

      closedir ($fp);
      return $filedata;
    }

    return false;
  }
  public static function mergeArrayRecursive ($files, &$a, $k = null) {
    if (!($files && is_array ($files))) return false;
    foreach ($files as $key => $file)
      if (is_array ($file)) $key . Step::mergeArrayRecursive ($file, $a, ($k ? rtrim ($k, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR : '') . $key);
      else array_push ($a, ($k ? rtrim ($k, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR : '') . $file);
  }
  public static function color ($string, $fColor = null, $background_color = null, $is_print = false) {
    if (!strlen ($string)) return "";
    $sColor = "";
    $keys = array ('n' => '30', 'w' => '37', 'b' => '34', 'g' => '32', 'c' => '36', 'r' => '31', 'p' => '35', 'y' => '33');
    if ($fColor && in_array (strtolower ($fColor), array_map ('strtolower', array_keys ($keys)))) {
      $fColor = !in_array (ord ($fColor[0]), array_map ('ord', array_keys ($keys))) ? in_array (ord ($fColor[0]) | 0x20, array_map ('ord', array_keys ($keys))) ? '1;' . $keys[strtolower ($fColor[0])] : null : $keys[$fColor[0]];
      $sColor .= $fColor ? "\033[" . $fColor . "m" : "";
    }
    $sColor .= $background_color && in_array (strtolower ($background_color), array_map ('strtolower', array_keys ($keys))) ? "\033[" . ($keys[strtolower ($background_color[0])] + 10) . "m" : "";

    if (substr ($string, -1) == "\n") { $string = substr ($string, 0, -1); $has_new_line = true; } else { $has_new_line = false; }
    $sColor .=  $string . "\033[0m";
    $sColor = $sColor . ($has_new_line ? "\n" : "");
    if ($is_print) printf ($sColor);
    return $sColor;
  }
  public static function array2dTo1d ($array) {
    $messages = array ();
    foreach ($array as $key => $value)
      if (is_array ($value)) $messages = array_merge ($messages, $value);
      else array_push ($messages, $value);
    return $messages;
  }
  public static function readFile ($file) {
    if (!file_exists ($file)) return false;
    if (function_exists ('file_get_contents')) return file_get_contents ($file);
    if (!$fp = @fopen ($file, 'rb')) return false;

    $data = '';
    flock ($fp, LOCK_SH);
    if (filesize ($file) > 0) $data =& fread ($fp, filesize ($file));
    flock ($fp, LOCK_UN);
    fclose ($fp);

    return $data;
  }
  public static function writeFile ($path, $data, $mode = 'wb') {
    if (!$fp = @fopen ($path, $mode)) return false;

    flock($fp, LOCK_EX);
    fwrite($fp, $data);
    flock($fp, LOCK_UN);
    fclose($fp);

    return true;
  }
}
