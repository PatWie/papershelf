<?php

$files = glob("../db/*.pdf");

foreach($files as $file){
    $pdf = $file;
    $jpg = str_replace('.pdf','.jpg',$file);
    if(!file_exists($jpg))
        system("montage ".$pdf."[0-7] -mode Concatenate -tile x1 -quality 80 -resize x230 -trim ".$jpg);
}