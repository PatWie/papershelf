<?php

$id = $_POST['id'];
echo "id:  ".$id;
$storeFolder = 'uploads';   //2
var_dump($_FILES);


switch ($_FILES['file']["error"]) {
    case UPLOAD_ERR_OK:
        $status = 'There is no error, the file uploaded with success.';
        break;
    case UPLOAD_ERR_INI_SIZE:
        $status = 'The uploaded file exceeds the upload_max_filesize directive in php.ini.';
        break;
    case UPLOAD_ERR_FORM_SIZE:
        $status = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.' .
            ' Value is set to: ' . $_POST['MAX_FILE_SIZE'];
        break;
    case UPLOAD_ERR_PARTIAL:
        $status = 'The uploaded file was only partially uploaded.';
        break;
    case UPLOAD_ERR_NO_FILE:
        $status = 'No file was uploaded.';
        break;
    case UPLOAD_ERR_NO_TMP_DIR:
        $status = 'Missing a temporary folder.';
        break;
    case UPLOAD_ERR_CANT_WRITE:
        $status = 'Failed to write file to disk.';
        break;
    case UPLOAD_ERR_EXTENSION:
        $status = 'A PHP extension stopped the file upload. PHP does not provide a way to ascertain which extension caused the file upload to stop; examining the list of loaded extensions with phpinfo() may help.';
        break;
    default:
        $status = 'No idea. Huh?';
    }
echo $status;

if (!empty($_FILES)) {
    $tempFile = $_FILES['file']['tmp_name'];          //3             
    $target = "../db/".$id.".pdf";  //4
    move_uploaded_file($tempFile,$target); //6
    echo "tempFile:  ".$tempFile;
    echo "target:  ".$target;
}
$content = ob_get_contents();
ob_end_clean();
file_put_contents("test.dat",$content);