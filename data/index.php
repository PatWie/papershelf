<?php


$filepath = '../db/';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = $request->id;
echo $filepath.$id.'.json';
file_put_contents($filepath.$id.'.json',json_encode($request));