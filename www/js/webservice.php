 <?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: X-gelen_dataed-With');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT');
header('Content-type: application/json;charset=utf-8');
date_default_timezone_set('Europe/Istanbul');

require ("dbconfig.php");
require ("autoload.php");
require ("sms/class.phpmailer.php");

$data = json_decode(file_get_contents('php://input'), true);
$service_type = $data["service_type"];

if (isset($_GET['sms'])) {
    $MessageBird = new \MessageBird\Client('ze3J3qB5GEyKK20vkDhIPXDvK');
    $Message = new \MessageBird\Objects\Message();
    $Message->originator = ORIGINATOR;
    $Message->recipients = array("+905554530363");
    $Message->body = 'Test Mesajı';

    $MessageBird->messages->create($Message);
    print 'message'.$_GET['sms'];
}


// mailgonder("anilsolmaz@gmail.com",$_GET['mail2'],file_get_contents('sms/onay_template.html'));


function mailGonder($addAddress, $subject, $body){
    $mail = new PHPMailer(); // create a new object
    $mail->IsSMTP(); // enable SMTP
    $mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
    $mail->SMTPAuth = true; // authentication enabled
    $mail->SMTPSecure = 'tls';
    $mail->Host = 'localhost';
    $mail->Port = 25;
    $mail->IsHTML(true);
    $mail->SetLanguage("tr", "phpmailer/language");
    $mail->CharSet  = "utf-8";

    $mail->Username = "info@microwebservice.net"; // Mail adresi
    $mail->Password = "Operics1234."; // Parola
    $mail->SetFrom("info@microwebservice.net", "Operics"); // Mail adresi

    $mail->AddAddress($addAddress); // Gönderilecek kişi

    $mail->Subject = $subject;
    $mail->Body = $body;

    return $mail->Send();
};







switch ($service_type) {

    case "giris":
        $email = $data["email"];
        $sifre = $data["sifre"];

        $sorgu = "SELECT * from LOGIN";
        $login_status = false;
        $sıra = 1;
        $error = "Böyle bir kullanıcı bulunamadı!";

        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
    	    if($row["USER_EMAIL"]==$email){
    	        $error = null;
    	            if($row["USER_PASSWORD"]==md5($sifre)){
    	                if($row["USER_TYPE"]=="passive"){
            				$error = "Profiliniz doğrulanmamıştır! Lütfen yeniden kayıt olup SMS onayı yapınız.";
            			} else {
            				$login_status = true;
                            $user_id = $row["ID"];
                            $user_type = $row["USER_TYPE"];
                            $user_name = $row["USER_NAME"];
            			}
    	            } else {
    	                $error = "Şifrenizi hatalı girdiniz! Lütfen tekrar deneyiniz.";

    	            }
    	            $sıra++;
    	        }

        }

            
        $rows[]=["login_status"=>$login_status,"id"=>$user_id,"error_message"=>$error,"user_type"=>$user_type,"user_name"=>$user_name];
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "create_user":
        $user_name = $data["name"];
        $user_password = $data["sifre"];
        $user_email = $data["email"];
        $user_phone = $data["phone"];
        $user_type = "passive";
        $user_company = 'company'; //$data["company"];
        $user_position = 'position'; //$data["position"];
        $user_date = date('Y-m-d H:i:s');
        $duplicate_email = "false";
        $duplicate_phone = "false"; 
            
        $sorgu = "SELECT `USER_EMAIL`, `USER_PHONE`, `USER_TYPE` FROM LOGIN WHERE `USER_EMAIL` = '".$user_email."' OR `USER_PHONE` = '".$user_phone."'";
            
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            if ($row['USER_EMAIL']==$USER_EMAIL) {
            	$duplicate_email = "true";
        	}
            if ($row['USER_PHONE']==$user_phone) {
            	$duplicate_phone = "true";
            }
            if ($row['USER_TYPE']=="passive") {
            	$status = "passive";
            }
        }
            
            if ($duplicate_email == "false" && $duplicate_phone == "false" || $status=="passive") {
        
        $sorgu = "INSERT INTO `LOGIN` (`ID`, `LANGUAGES_ID`, `USER_PASSWORD`, `USER_EMAIL`, `USER_PHONE`, `USER_PHOTO`, `USER_TYPE`, `USER_COMPANY`, `USER_POSITION`, `USER_NAME`) VALUES (NULL, '+90', '".md5($user_password)."', '".$user_email."', '".$user_phone."', 'img/team/3.png', '".$user_type."', '".$user_company."', '".$user_position."', '".$user_name."');";
        $data = $conn->query($sorgu);


        $sorgu = "SELECT `ID` FROM LOGIN WHERE `USER_EMAIL` = '".$user_email."' AND `USER_PHONE` = '".$user_phone."'  ORDER BY ID DESC LIMIT 1";   
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $user_id = $row['ID'];
        }
              

        $sorgu = "DELETE FROM LOGIN WHERE USER_EMAIL = '".$user_email."' AND USER_TYPE = 'passive' AND ID!=".$user_id;     
        $data = $conn->query($sorgu);


        $rand_sms_code = rand(1000,9999);
        $sorgu = "INSERT INTO `SMS` (`ID`, `LOGIN_ID`, `S_CODE`, `S_DATE`) VALUES (NULL, '".$user_id."', '".$rand_sms_code."', '".$user_date."');";
        $data = $conn->query($sorgu);
/*
        $MessageBird = new \MessageBird\Client('ze3J3qB5GEyKK20vkDhIPXDvK'); // tqQvcinrdaouKUcgUr2zyW6lf
        $Message = new \MessageBird\Objects\Message();
        $Message->originator = ORIGINATOR;
        $Message->recipients = array('+'.$user_phone);
        $Message->body = 'Welcome to Operics! Your verification code is : '.$rand_sms_code;
        $MessageBird->messages->create($Message);
    */                    
        $create_status = 1;

        /*
            $MessageBird = new \MessageBird\Client('ze3J3qB5GEyKK20vkDhIPXDvK');
    		$Message = new \MessageBird\Objects\Message();
    		$Message->originator = ORIGINATOR;
    		$Message->recipients = $user_phone;
    		$Message->body = $rand_sms_code;

    		$MessageBird->messages->create($Message);

            */
        } else {
            $create_status = 0;
        }
        $rows[]=["create_status"=>$create_status,"user_id"=>$user_id,"duplicate_email"=>$duplicate_email,"duplicate_phone"=>$duplicate_phone];
                
                
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "sms_verify":
    $user_id = $data["user_id"];
    $sms_code = $data["sms_code"];

    $sorgu = "SELECT S_CODE FROM SMS WHERE LOGIN_ID=".$user_id." ORDER BY S_DATE DESC LIMIT 2";
    $data = $conn->query($sorgu);
    foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $rows[] = $row;
    }

    if ($rows[0]["S_CODE"]==$sms_code) {
        $create_status = "true";
        $sorgu = "UPDATE LOGIN SET user_type = 'user' WHERE id=".$user_id;
        $data = $conn->query($sorgu);
        
    } else {
        $create_status = "false";
    }

    $cevap[]=["create_status"=>$create_status];
    print json_encode($cevap, JSON_UNESCAPED_UNICODE);
    break;

    case "hikayeler":
        $sorgu = "SELECT * FROM STORIES";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "hizmetler":
        $sorgu = "CALL service();";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;
        
    case "egitimler":
        $sorgu = "SELECT * FROM COURSE";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "referanslar":
        $sorgu = "SELECT * FROM REFERENCE";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "sozluk":
        $login_id=$data["user_id"];
        $sorgu = "
        SELECT F.LOGIN_ID, DIC.WORD, DIC.DESCRIPTION
        FROM DICTIONARY DIC
        LEFT JOIN FAVORITES F ON F.DICTIONARY_ID = DIC.ID
        AND F.LOGIN_ID=".$login_id." 
        ORDER BY DIC.WORD ASC";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "ekip":
        $sorgu = "SELECT * FROM TEAMS";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "profil":
        $user_id = $data["user_id"];
        $sorgu = "SELECT `ID`,`USER_NAME`,`USER_PHOTO`,`USER_EMAIL`,`USER_TYPE`,`USER_PHONE`,`USER_POSITION`,`USER_COMPANY` FROM LOGIN WHERE `ID` = ".$user_id;   
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "kursa_katil":
        $user_id = $data["user_id"];
        $course_id = $data["course_id"];
        $sorgu = "INSERT INTO `ENROLL` (`LOGIN_ID`, `COURSE_ID`) VALUES ('".$user_id."', '".$course_id."')";
        $data = $conn->query($sorgu);
    break;

    case "kursu_iptal_et":
        $user_id = $data["user_id"];
        $course_id = $data["course_id"];
        $sorgu = "DELETE FROM `ENROLL` WHERE (`ENROLL`.`LOGIN_ID` = ".$user_id." AND `ENROLL`.`COURSE_ID` = ".$course_id.")";
        $data = $conn->query($sorgu);
    break;

    case "favori_ekle":
        $user_id = $data["user_id"];
        $word_id = $data["word_id"];
        $sorgu = "INSERT INTO `FAVORITES` (`DICTIONARY_ID`, `LOGIN_ID`) VALUES ('".$word_id."', '".$user_id."')";
        $data = $conn->query($sorgu);
    break;

    case "favori_cikar":
        $user_id = $data["user_id"];
        $word_id = $data["word_id"];
        $sorgu = "DELETE FROM `FAVORITES` WHERE (`FAVORITES`.`DICTIONARY_ID` = ".$word_id." AND `FAVORITES`.`LOGIN_ID` = ".$user_id.")";
        $data = $conn->query($sorgu);
    break;

    case "diller":
        $dil = $data['language'];
        $sorgu = "SELECT ID,ATT_NAME,".$dil." AS kelime FROM DICTIONARY_LANG
    	GROUP BY  ID,
    	         ATT_NAME,
    	         ".$dil."
    	ORDER BY ID";	
        $data = $conn->query($sorgu);

    	foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "admin_users_detail":
   		$sorgu = "SELECT `ID`,`USER_NAME`,`USER_PHOTO`,`USER_EMAIL`,`USER_TYPE`,`USER_PHONE`,`USER_POSITION`,`USER_COMPANY` FROM LOGIN";  
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "admin_user_block":
        $user_id = $data["user_id"];
        $sorgu = "UPDATE `LOGIN` SET USER_TYPE = 'banned' WHERE ID=".$user_id;
        $data = $conn->query($sorgu);
    break;

    case "admin_user_unblock":
        $user_id = $data["user_id"];
        $sorgu = "UPDATE `LOGIN` SET USER_TYPE = 'active' WHERE ID=".$user_id;
        $data = $conn->query($sorgu);
    break;

    case "hizmet_ekle":
        $service_name = $data["service_name"];
        $service_description = $data["service_description"];
        $service_image = $data["service_image"];

        $sorgu = "INSERT INTO `SERVICE` (`SERVICE_NAME`, `DESCRIPTION`, `SERVICE_IMAGE`) VALUES ('".$service_name."','".$service_description."','".$service_image."')";
        $data = $conn->query($sorgu);
    break;

    case "hizmet_guncelle":
        $service_id = $data["service_id"];
        $service_name = $data["service_name"];
        $service_description = $data["service_description"];
        $service_image = $data["service_image"];

        $sorgu = "UPDATE `SERVICE` SET SERVICE_NAME = ".$service_name." , DESCRIPTION = ".$service_description.", SERVICE_IMAGE = ".$service_image." WHERE ID=".$service_id;
        $data = $conn->query($sorgu);
    break;

    case "hizmet_sil":
        $service_id = $data["service_id"];
        $sorgu = "DELETE FROM `SERVICE` WHERE ID=".$service_id;
        $data = $conn->query($sorgu);
    break;

    case "referans_ekle":
        $reference_name = $data["reference_name"];
        $reference_image = $data["reference_image"];

        $sorgu = "INSERT INTO `REFERENCE` (`REF_NAME`, `REF_PHOTO`) VALUES ('".$reference_name."','".$reference_image."')";
        $data = $conn->query($sorgu);
    break;

    case "referans_guncelle":
        $reference_id = $data["reference_id"];
        $reference_name = $data["reference_name"];
        $reference_image = $data["reference_image"];

        $sorgu = "UPDATE `REFERENCE` SET REF_NAME = ".$reference_name." , REF_PHOTO = ".$reference_image." WHERE ID=".$reference_id;
        $data = $conn->query($sorgu);
    break;

    case "referans_sil":
        $reference_id = $data["reference_id"];
        $sorgu = "DELETE FROM `REFERENCE` WHERE ID=".$reference_id;
        $data = $conn->query($sorgu);
    break;

    case "calisan_ekle":
        $team_name = $data["team_name"];
        $team_position = $data["team_position"];
        $team_about = $data["team_about"];
        $team_image = $data["team_image"];
        $team_linkedin = $data["team_linkedin"];

        $sorgu = "INSERT INTO `TEAMS` (`NAME`, `POSITION`, `ABOUT`, `IMAGE`, `LINKEDIN`) VALUES ('".$team_name."','".$team_position."','".$team_about."','".$team_image."','".$team_linkedin."')";
        $data = $conn->query($sorgu);
    break;

    case "calisan_guncelle":
        $team_id = $data["team_id"];
        $team_name = $data["team_name"];
        $team_position = $data["team_position"];
        $team_about = $data["team_about"];
        $team_image = $data["team_image"];
        $team_linkedin = $data["team_linkedin"];

        $sorgu = "UPDATE `TEAMS` SET NAME = ".$team_name.", POSITION = ".$team_position.", ABOUT = ".$team_about.", IMAGE = ".$team_image.", LINKEDIN = ".$team_linkedin." WHERE ID=".$team_id;
        $data = $conn->query($sorgu);
    break;

    case "calisan_sil":
        $team_id = $data["team_id"];
        $sorgu = "DELETE FROM `TEAMS` WHERE ID=".$team_id;
        $data = $conn->query($sorgu);
    break;

    case "egitim_ekle":
        $team_name = $data["team_name"];

        $sorgu = "INSERT INTO `TEAMS` (`NAME`, `POSITION`, `ABOUT`, `IMAGE`, `LINKEDIN`) VALUES ('".$team_name."','".$team_position."','".$team_about."','".$team_image."','".$team_linkedin."')";
        $data = $conn->query($sorgu);
    break;

    case "egitim_guncelle":
        $team_id = $data["team_id"];
        $team_name = $data["team_name"];
        $team_position = $data["team_position"];
        $team_about = $data["team_about"];
        $team_image = $data["team_image"];
        $team_linkedin = $data["team_linkedin"];

        $sorgu = "UPDATE `TEAMS` SET NAME = ".$team_name.", POSITION = ".$team_position.", 
            ABOUT = ".$team_about.", IMAGE = ".$team_image.", LINKEDIN = ".$team_linkedin." 
            WHERE ID=".$team_id"";
        $data = $conn->query($sorgu);
    break;

    case "egitim_sil":
        $course_id = $data["course_id"];
        $sorgu = "DELETE FROM `COURSE` WHERE ID=".$course_id;
        $data = $conn->query($sorgu);
    break;

    case "kelime_ekle":
        //deneme;
        //deneme;
    break;

    case "kelime_guncelle":
        //deneme;
        //deneme;
    break;

    case "kelime_sil":
        //deneme;
        //deneme;
    break;

    case "iletisim_ekle":
        //deneme;
        //deneme;
    break;

    case "iletisim_guncelle":
        //deneme;
        //deneme;
    break;

    case "iletisim_sil":
        //deneme;
        //deneme;
    break;

    case "story_ekle":
        //deneme;
        //deneme;
    break;

    case "story_guncelle":
        //deneme;
        //deneme;
    break;

    case "story_sil":
        //deneme;
        //deneme;
    break;

    case "version_check":
  
        $sorgu = "SELECT * FROM VERSIONS";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }
        $rows[] = ["TABLE_NAME"=>"COURSE","TABLE_VERSION"=>"0"];
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;





}








exit;
    

    
    
$conn = null;
?>
