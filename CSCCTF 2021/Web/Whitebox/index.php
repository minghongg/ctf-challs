<?php

if($_GET['debug']== 1){
    highlight_file('index.php');
}

if(isset($_GET['c'])){
    $c = $_GET['c'];
    if(is_array($c) || strlen($c) >33){
        die("Be nice please...");
    }
    if(preg_match("/[\!\@\#c\$\%\^\&\)\+\-n\~\`\[\|\\\:\;\\\"\?\.]/i",$c)){
        $c = "hacker";
    }

    $count = 0;
    $counter = 0;
    foreach(str_split($c) as $char){
        if($char == chr(40)){
            if($count != 0){
                for($i = $count-1; $count>=0; $count--){
                    if(preg_match("/[A-Za-z]/", $c[$count])){
                        $counter++;
                    }
                }
            }
        }
        if($counter >3){
            $c = "hacker";
            break;
        }  
        $count++;
    }

    eval("echo 'Hi ".$c.", nice to meet you!';");

}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whitebox</title>
</head>
<body>
    <!-- ?debug=1 -->
</body>
</html>