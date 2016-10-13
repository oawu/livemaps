<?php

/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 * @website     http://www.ioa.tw/
 *
 * Need to run init.php
 *
 */

define ('PHP', '.php');
define ('PATH', implode (DIRECTORY_SEPARATOR, explode (DIRECTORY_SEPARATOR, dirname (str_replace (pathinfo (__FILE__, PATHINFO_BASENAME), '', __FILE__)))) . '/');
define ('PATH_CMD', PATH . 'cmd' . DIRECTORY_SEPARATOR);
define ('PATH_CMD_LIBS', PATH_CMD . 'libs' . DIRECTORY_SEPARATOR);

include_once PATH_CMD_LIBS . 'defines' . PHP;
include_once PATH_CMD_LIBS . 'Step' . PHP;
include_once PATH_CMD_LIBS . 'Minify' . DIRECTORY_SEPARATOR . 'Min' . PHP;

Step::start ();

$file = array_shift ($argv);
$argv = Step::params ($argv, array (array ('-b', '-bucket'), array ('-a', '-access'), array ('-s', '-secret'), array ('-u', '-upload'), array ('-m', '-minify')));
if (!(isset ($argv['-b'][0]) && ($bucket = trim ($argv['-b'][0], '/')) && isset ($argv['-a'][0]) && ($access = $argv['-a'][0]) && isset ($argv['-s'][0]) && ($secret = $argv['-s'][0]))) {
  echo str_repeat ('=', 80) . "\n";
  echo ' ' . Step::color ('◎', 'R') . ' ' . Step::color ('錯誤囉！', 'r') . Step::color ('請確認參數是否正確，分別需要', 'p') . ' ' . Step::color ('-b', 'W') . '、' . Step::color ('-a', 'W') . '、' . Step::color ('-s', 'W') . Step::color (' 的參數！', 'p') . ' ' . Step::color ('◎', 'R');
  echo "\n" . str_repeat ('=', 80) . "\n\n";
  exit ();
}

define ('BUCKET', $bucket);
define ('ACCESS', $access);
define ('SECRET', $secret);

define ('UPLOAD', isset ($argv['-u'][0]) && is_numeric ($tmp = $argv['-u'][0]) ? $tmp ? true : false : true);
define ('MINIFY', isset ($argv['-m'][0]) && is_numeric ($tmp = $argv['-m'][0]) ? $tmp ? true : false : true);

// 開始執行
Step::init ();

// ---------------
if (!UPLOAD) {
  Step::usage ();
  Step::end ();
  Step::showUrl ();
  echo "\n";
  exit ();
}
// ---------------

// 設定好要上傳的資料夾位置 與 檔案類型
Step::setUploadDirs (array (
    'js' => array ('js'),
    'css' => array ('css'),
    'font' => array ('eot', 'svg', 'ttf', 'woff'),
    'img' => array ('png', 'jpg', 'jpeg', 'gif', 'svg'),
    '' => array ('html', 'txt')
  ));


// ---------------
include_once PATH_CMD_LIBS . 'S3' . PHP;

Step::initS3 (ACCESS, SECRET);
Step::listLocalFiles ();
Step::listS3Files ();
// ---------------

$files = Step::filterLocalFiles ();
Step::uploadLocalFiles ($files);
$files = Step::filterS3Files ();
Step::deletwS3Files ($files);
// ---------------

Step::usage ();
Step::end ();
Step::showUrl ();
echo "\n";
exit ();
