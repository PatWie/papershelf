<?php

$files = glob("../db/*.json");
$res = array();
for($i=0;$i<count($files);$i++){
    $t = json_decode(file_get_contents($files[$i]));
    if(isset($t->id)){
    	if(file_exists("../db/".$t->id.".pdf"))
        	$t->pdf = "db/".$t->id.".pdf";
    if(file_exists("../db/".$t->id.".jpg"))
        $t->jpg = "db/".$t->id.".jpg";
    $res[] = $t;
    }
    

}
echo json_encode($res);