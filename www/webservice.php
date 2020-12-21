﻿ <?php

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
        $dil   = $data['language'];

        $sorgu = "SELECT * from LOGIN";
        $login_status = false;
        $sıra = 1;

        if ($dil == 'TR' ) {
            $error = "Böyle bir kullanıcı bulunamadı!";
        } else if ($dil == 'EN' ) {
            $error =  "User not found!";
        } else if ($dil == 'DE' ) {
            $error =  "Benutzer wurde nicht gefunden!";
        }

        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
    	    if($row["USER_EMAIL"]==$email){
    	        $error = null;
    	            if($row["USER_PASSWORD"]==md5($sifre)){
    	                if($row["USER_TYPE"]=="passive"){
                          if ($dil == 'TR' ) {
                            $error = "Profiliniz doğrulanmamıştır! Lütfen yeniden kayıt olup SMS onayı yapınız.";
                          } else if ($dil == 'DE' ) {
                            $error =  "Ihr Profil wurde nicht verifiziert! Bitte melden Sie sich erneut an und bestätigen Sie SMS.";
                          } else {
                            $error =  "Your profile has not been verified! Please re-register and confirm SMS.";
                          }
            			    } else if ($row["USER_TYPE"]=="banned"){
                          if ($dil == 'TR' ) {
                            $error = "Uygulamaya erişiminiz yönetim tarafından engellenmiştir.";
                          } else if ($dil == 'DE' ) {
                            $error =  "Ihr Zugriff auf die Anwendung wurde vom Management blockiert.";
                          } else {
                            $error =  "Your access to the application has been blocked by administration.";
                          }
                      } else {
                          $login_status = true;
                          $user_id = $row["ID"];
                          $user_type = $row["USER_TYPE"];
                          $user_name = $row["USER_NAME"];
            			    }
    	            } else {
                        if ($dil == 'TR' ) {
    	                   $error = "Şifrenizi yanlış girdiniz! Lütfen tekrar deneyiniz.";
                        } else if ($dil == 'EN' ) {
                            $error =  "Your password is invalid! Please try again.";
                        } else if ($dil == 'DE' ) {
                            $error =  "Sie haben Ihr Passwort falsch eingegeben! Bitte versuchen Sie es erneut.";
                        }

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
            if ($row['USER_EMAIL']==$user_email) {
            	$duplicate_email = "true";
        	}
            if ($row['USER_PHONE']==$user_phone) {
            	$duplicate_phone = "true";
            }
            if ($row['USER_TYPE']=="passive") {
            	$status = "passive";
            }
        }

        if (($duplicate_email == "false" && $duplicate_phone == "false") || $status=="passive") {

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

    case "reset_password":
        $email = $data["email"];
        $dil   = $data['language'];

        $sorgu = "SELECT * from LOGIN";
        $is_valid = false;
        $sıra = 1;

        if ($dil == 'TR' ) {
            $error = "Böyle bir kullanıcı bulunamadı!";
        } else if ($dil == 'DE' ) {
          $error =  "Benutzer wurde nicht gefunden!";
        } else {
            $error =  "User not found!";
        }

        $data = $conn->query($sorgu);
         foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            if($row["USER_EMAIL"]==$email) {
                $user_id = $row['ID'];
                $is_valid = true;

                if ($dil == 'TR' ) {
                    $error = "Şifre yenileme talebiniz e-postanıza iletilmiştir. Lütfen posta kutunuzu kontrol ediniz.";
                } else if ($dil == 'EN' ) {
                    $error =  "Your password renewal request has been sent to your e-mail. Please check your mailbox.";
                } else if ($dil == 'DE' ) {
                     $error =  "Ihre Anfrage zur Passworterneuerung wurde an Ihre E-Mail gesendet. Bitte überprüfen Sie Ihre Mailbox.";
                }

                //bu kısıma kullanılacak olan email şifre yenileme servisinin çağrılacağı metod girilir
                $data = $conn->query($sorgu);
                $sıra++;
            }
        }

        $rows[]=["is_valid"=>$is_valid,"id"=>$user_id,"error_message"=>$error];
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
        $language       = $data["language"];
        if ($language == 'TR') {
            $language   = '+90';
        } else if ($language == 'DE') {
            $language   = '+49';
        } else {
            $language   = '+44';
        }

        $sorgu = "SELECT * FROM STORIES WHERE LANGUAGES_ID = $language";
        $data  = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "hizmetler":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language   = '+90';
        } else if ($language == 'DE') {
            $language   = '+49';
        } else {
            $language   = '+44';
        }

        $sorgu = "SELECT * FROM SERVICE WHERE LANGUAGES_ID = $language";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "egitimler":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language   = '+90';
        } else if ($language == 'DE') {
            $language   = '+49';
        } else {
            $language   = '+44';
        }

        $sorgu = "SELECT * FROM COURSE WHERE LANGUAGES_ID = $language";
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
        $language       = $data["language"];
        if ($language == 'TR') {
            $language   = '+90';
        } else if ($language == 'DE') {
            $language   = '+49';
        } else {
            $language   = '+44';
        }

        $sorgu = "SELECT * FROM DICTIONARY WHERE LANG_ID = $language";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    /*case "favlist":
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
    */

    case "ekip":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language   = '+90';
        } else if ($language == 'DE') {
            $language   = '+49';
        } else {
            $language   = '+44';
        }

        $sorgu = "SELECT * FROM TEAMS WHERE LANGUAGES_ID = $language";
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

    case "reordering":

    break;


    case "kursa_katildi_mi":
        $user_id    = $data["user_id"];
        $course_id  = $data["course_id"];

        $sorgu = "SELECT * from ENROLL";
        $is_enrolled = false;
        $sıra = 1;

        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            if($row["LOGIN_ID"]==$user_id){
                if($row["COURSE_ID"]==$course_id){
                    $is_enrolled = true;
                }
                 $sıra++;
            }

        }

        $rows[]=["is_enrolled"=>$is_enrolled];
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "kursa_katil":
        $user_id    = $data["user_id"];
        $course_id  = $data["course_id"];
        $sorgu = "INSERT INTO `ENROLL` (`LOGIN_ID`, `COURSE_ID`) VALUES ('".$user_id."', '".$course_id."')";
        $data = $conn->query($sorgu);
    break;

    case "kursu_iptal_et":
        $user_id    = $data["user_id"];
        $course_id  = $data["course_id"];
        $sorgu = "DELETE FROM `ENROLL` WHERE (`ENROLL`.`LOGIN_ID` = ".$user_id." AND `ENROLL`.`COURSE_ID` = ".$course_id.")";
        $data = $conn->query($sorgu);
    break;

    case "kelime_favladi_mi":
        $user_id    = $data["user_id"];
        $word_id    = $data["word_id"];

        $sorgu = "SELECT * from FAVORITES";
        $is_faved = false;
        $sıra = 1;

        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            if($row["LOGIN_ID"] == $user_id) {
                if($row["DICTIONARY_ID"]  == $word_id) {
                    $is_faved = true;
                }
                $sıra++;
            }
        }
        $rows[]=["is_faved"=>$is_faved];
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "favori_ekle":
        $user_id = $data["user_id"];
        $word_id = $data["word_id"];
        $sorgu   = "INSERT INTO `FAVORITES` (`LOGIN_ID`, `DICTIONARY_ID`) VALUES ('$user_id', '$word_id')";
        $data    = $conn->query($sorgu);
    break;

    case "favori_cikar":
        $user_id = $data["user_id"];
        $word_id = $data["word_id"];
        $sorgu   = "DELETE FROM `FAVORITES` WHERE (`FAVORITES`.`LOGIN_ID` = ".$user_id." AND `FAVORITES`.`DICTIONARY_ID` = ".$word_id.")";
        $data    = $conn->query($sorgu);
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
        $sorgu = "UPDATE `LOGIN` SET USER_TYPE = 'user' WHERE ID=".$user_id;
        $data = $conn->query($sorgu);
    break;

    case "admin_user_delete":
        $user_id = $data["user_id"];
        $sorgu = "DELETE FROM `LOGIN` WHERE ID=".$user_id;
        $data = $conn->query($sorgu);
        $sorgu = "DELETE FROM `ENROLL` WHERE LOGIN_ID=".$user_id;
        $data = $conn->query($sorgu);
    break;

    case "catchPP":
        $deal_pictureUrl = $data['photoLink'];
        $urldate         = date('Y-m-d-His');

        file_put_contents("img/pics/".$urldate.".jpeg", base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $deal_pictureUrl)));

        $photo_url = "http://www.microwebservice.net/operics_web/img/pics/".$urldate.".jpeg";
        $rows[]=["photo_link"=>$photo_url];

        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "hizmet_ekle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $service_image = $data["service_image"];
        $service_name = $data["service_name"];
        $service_description = $data["service_description"];

        $sorgu = "INSERT INTO `SERVICE` (`LANGUAGES_ID`, `SERVICE_NAME`, `DESCRIPTION`, `SERVICE_IMAGE`) VALUES ('$language','$service_name','$service_description','$service_image')";
        $data = $conn->query($sorgu);
    break;

    case "hizmet_guncelle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $service_id = $data["service_id"];
        $service_image = $data["service_image"];
        $service_name = $data["service_name"];
        $service_description = $data["service_description"];

        $sorgu = "UPDATE `SERVICE` SET LANGUAGES_ID = '$language', SERVICE_NAME = '$service_name', DESCRIPTION = '$service_description', SERVICE_IMAGE = '$service_image' WHERE ID=".$service_id;
        $data = $conn->query($sorgu);
    break;

    case "hizmet_sil":
        $service_id = $data["service_id"];
        $sorgu = "DELETE FROM `SERVICE` WHERE ID=".$service_id;
        $data = $conn->query($sorgu);
    break;

    case "referans_ekle":
        $reference_image = $data["reference_image"];
        $reference_name = $data["reference_name"];

        $sorgu = "INSERT INTO `REFERENCE` (`REF_NAME`, `REF_PHOTO`) VALUES ('$reference_name','$reference_image')";
        $data = $conn->query($sorgu);
    break;

    case "referans_guncelle":
        $reference_id = $data["reference_id"];
        $reference_image = $data["reference_image"];
        $reference_name = $data["reference_name"];

        $sorgu = "UPDATE `REFERENCE` SET REF_NAME = '$reference_name' , REF_PHOTO = '$reference_image' WHERE ID=".$reference_id;
        $data = $conn->query($sorgu);
    break;

    case "referans_sil":
        $reference_id = $data["reference_id"];
        $sorgu = "DELETE FROM `REFERENCE` WHERE ID=".$reference_id;
        $data = $conn->query($sorgu);
    break;

    case "calisan_ekle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $team_image = $data["team_image"];
        $team_name = $data["team_name"];
        $team_position = $data["team_position"];
        $team_about = $data["team_about"];
        $team_linkedin = $data["team_linkedin"];

        $sorgu = "INSERT INTO `TEAMS` (`LANGUAGES_ID`, `NAME`, `POSITION`, `ABOUT`, `IMAGE`, `LINKEDIN`) VALUES ('$language','$team_name','$team_position','$team_about','$team_image','$team_linkedin')";
        $data = $conn->query($sorgu);
    break;

    case "calisan_guncelle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $team_id = $data["team_id"];
        $team_image = $data["team_image"];
        $team_name = $data["team_name"];
        $team_position = $data["team_position"];
        $team_about = $data["team_about"];
        $team_linkedin = $data["team_linkedin"];

        $sorgu = "UPDATE `TEAMS` SET LANGUAGES_ID = '$language', NAME = '$team_name' , POSITION = '$team_position' , ABOUT = '$team_about' , IMAGE = '$team_image', LINKEDIN = '$team_linkedin' WHERE ID=".$team_id;
        $data = $conn->query($sorgu);
    break;

    case "calisan_sil":
        $team_id = $data["team_id"];
        $sorgu = "DELETE FROM `TEAMS` WHERE ID=".$team_id;
        $data = $conn->query($sorgu);
    break;

    case "egitim_ekle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $course_image       = $data["course_image"];
        $course_name        = $data["course_name"];
        $course_description = $data["course_description"];
        $course_city        = 'Ankara';
        $course_hour        = $data["course_hour"];
        $course_adress      = $data["course_adress"];
        $course_bgdate      = $data["course_bgdate"];
        $course_endate      = $data["course_endate"];

        $sorgu = "INSERT INTO `COURSE` (`LANGUAGES_ID`, `CRS_NAME`, `CRS_DESCRIPTION`, `CRS_PHOTO`, `CRS_CITY`, `CRS_HOUR`, `CRS_ADRESS`, `CRS_ENDDATE`, `CRS_BEGINDATE`) VALUES ('$language','$course_name','$course_description','$course_image','$course_city','$course_hour','$course_adress','$course_endate','$course_bgdate')";
        $data = $conn->query($sorgu);
    break;

    case "egitim_guncelle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $course_id          = $data["course_id"];
        $course_image       = $data["course_image"];
        $course_name        = $data["course_name"];
        $course_description = $data["course_description"];
        $course_city        = 'Ankara';
        $course_hour        = $data["course_hour"];
        $course_adress      = $data["course_adress"];
        $course_bgdate      = $data["course_bgdate"];
        $course_endate      = $data["course_endate"];

        $sorgu = "UPDATE `COURSE` SET LANGUAGES_ID = '$language', CRS_NAME = '$course_name' , CRS_DESCRIPTION = '$course_description' , CRS_PHOTO = '$course_image' , CRS_CITY = '$course_city', CRS_HOUR = '$course_hour' , CRS_ADRESS = '$course_adress' , CRS_ENDDATE = '$course_endate' , CRS_BEGINDATE = '$course_bgdate' WHERE ID=".$course_id;
        $data = $conn->query($sorgu);
    break;

    case "egitim_sil":
        $course_id          = $data["course_id"];
        $sorgu              = "DELETE FROM `COURSE` WHERE ID=".$course_id;
        $data               = $conn->query($sorgu);
    break;

    case "kelime_ekle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $word_name          = $data["word_name"];
        $word_description   = $data["word_description"];

        $sorgu              = "INSERT INTO `DICTIONARY` (`LANG_ID`, `WORD`, `DESCRIPTION`) VALUES ('$language','$word_name','$word_description')";
        $data               = $conn->query($sorgu);
    break;

    case "kelime_guncelle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $word_id            = $data["word_id"];
        $word_name          = $data["word_name"];
        $word_description   = $data["word_description"];

        $sorgu              = "UPDATE `DICTIONARY` SET LANG_ID = '$language', WORD = '$word_name' , DESCRIPTION = '$word_description' WHERE ID=".$word_id;
        $data               = $conn->query($sorgu);
    break;

    case "kelime_sil":
        $word_id            = $data["word_id"];
        $sorgu              = "DELETE FROM `DICTIONARY` WHERE ID=".$word_id;
        $data               = $conn->query($sorgu);
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
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $story_head     = $data["story_head"];
        $story_about    = $data["story_about"];
        $story_image    = $data["story_image"];

        $sorgu = "INSERT INTO `STORIES` (`LANGUAGES_ID`, `STR_HEAD`, `STR_DESCRIPTION`, `STR_IMAGE`) VALUES ('$language','$story_head','$story_about','$story_image')";
        $data = $conn->query($sorgu);
    break;

    case "story_guncelle":
        $language       = $data["language"];
        if ($language == 'TR') {
            $language = '+90';
        } else if ($language == 'DE') {
            $language = '+49';
        } else {
            $language = '+44';
        }
        $story_id       = $data["story_id"];
        $story_head     = $data["story_head"];
        $story_about    = $data["story_about"];
        $story_image    = $data["story_image"];

        $sorgu = "UPDATE `STORIES` SET LANGUAGES_ID = '$language', STR_HEAD = '$story_head' , STR_DESCRIPTION = '$story_about' , STR_IMAGE = '$story_image'  WHERE ID=".$story_id;
        $data = $conn->query($sorgu);
    break;

    case "story_sil":
        $story_id = $data["story_id"];
        $sorgu = "DELETE FROM `STORIES` WHERE ID=".$story_id;
        $data = $conn->query($sorgu);
    break;

    case "get_current_version":
        $sorgu = "SELECT * FROM VERSIONS";
        $data = $conn->query($sorgu);
        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $rows[]=$row;
        }
        print json_encode($rows, JSON_UNESCAPED_UNICODE);
    break;

    case "version_check":
        $language_version   = $data["language_version"];
        $story_version      = $data["story_version"];
        $service_version    = $data["service_version"];
        $team_version       = $data["team_version"];
        $reference_version  = $data["reference_version"];
        $dictionary_version = $data["dictionary_version"];
        $course_version     = $data["course_version"];
        $about_us_version   = $data["about_us_version"];


        $response_lan  = false;
        $response_sto  = false;
        $response_ser  = false;
        $response_tea  = false;
        $response_ref  = false;
        $response_dic  = false;
        $response_cou  = false;
        $response_abo  = false;

        $sorgu = "SELECT * FROM VERSIONS";
        $data = $conn->query($sorgu);

        foreach ($data->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $ver[] = $row;
        }

        if($ver[7]['TABLE_VERSION']==$language_version) {
            $response_lan  = true;
        }

        if($ver[1]['TABLE_VERSION']==$story_version) {
            $response_sto  = true;
        }

        if($ver[2]['TABLE_VERSION']==$service_version) {
            $response_ser  = true;
        }

        if($ver[3]['TABLE_VERSION']==$teams_version) {
            $response_tea  = true;
        }

        if($ver[4]['TABLE_VERSION']==$reference_version) {
            $response_ref  = true;
        }

        if($ver[5]['TABLE_VERSION']==$dictionary_version) {
            $response_dic  = true;
        }

        if($ver[6]['TABLE_VERSION']==$course_version) {
            $response_cou  = true;
        }


        if($ver[8]['TABLE_VERSION']==$about_us_version) {
            $response_abo  = true;
        }

        $rows[]=["response_lan"=>$response_lan,"response_sto"=>$response_sto,"response_ser"=>$response_ser,"response_tea"=>$response_lan,"response_ref"=>$response_ref,"response_dic"=>$response_dic,"response_cou"=>$response_cou,"response_abo"=>$response_abo];

        print json_encode($rows, JSON_UNESCAPED_UNICODE);

    break;


}


exit;

$conn = null;
?>
