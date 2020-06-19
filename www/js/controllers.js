angular.module('starter.controllers', [])

  .controller('MainCtrl', function ($scope, $state, $rootScope, $stateParams, $ionicModal, $http, $ionicPopup) {

    $rootScope.webServiceUrl = "http://www.microwebservice.net/operics_web/webservice.php";
    $scope.pictureUrl = "http://placehold.it/200x200";


    var ServiceRequest = {
      service_type: "admin_users_detail",
    }

    $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
      $scope.userlist = data
    })    
    

    $scope.user_yasakla = function(userId){
      var ServiceRequest = {
        service_type: "admin_user_block",
        user_id: userId
      }

      $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
      })
    }

    $scope.user_yasak_kaldir = function(userId){
      var ServiceRequest = {
        service_type: "admin_user_unblock",
        user_id: userId
      }

      $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
      })
    }


  


    //Girişte sorgulanacak parametreler
    $scope.loginData                    = {};
    $scope.kayitData                    = {};
    $scope.resetPass                    = {};
    $scope.smsVerify                    = {};
    $scope.editInput                    = {};
    $scope.inputField                   = {};
    $scope.language                     = localStorage.getItem('language');
    $scope.userId                       = localStorage.getItem('user_id');
    $scope.loginStatus                  = localStorage.getItem('loginStatus');
    $scope.isAdmin                      = localStorage.getItem('isAdmin');
    $scope.languageOld                  = localStorage.getItem('languageOld');
    $scope.diller                       = JSON.parse(localStorage.getItem('dillerJson'));
    $scope.hikayeler                    = JSON.parse(localStorage.getItem('hikayeJson'));
    $scope.hizmetler                    = JSON.parse(localStorage.getItem('hizmetJson'));
    $scope.ekip                         = JSON.parse(localStorage.getItem('ekipJson'));
    $scope.referanslar                  = JSON.parse(localStorage.getItem('referansJson'));
    $scope.egitimler                    = JSON.parse(localStorage.getItem('egitimJson'));
    $scope.sozluk                       = JSON.parse(localStorage.getItem('sozlukJson'));
    $scope.profil                       = JSON.parse(localStorage.getItem('profilJson'));
    $scope.savedVersions                = JSON.parse(localStorage.getItem('savedVersionJson'));
     
   
    // Version Kontrolü
    
    var ServiceRequest = {
      service_type: "version_check"
    }

    // Service request değişkeni web service post edilir. Gelen yanıt $scope.giris isimli değişkene atanır.
    $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
      $scope.versions = data

      if (!$scope.savedVersions) {
        localStorage.setItem('savedVersionJson', JSON.stringify($scope.versions));
        $scope.savedVersions = JSON.parse(localStorage.getItem('savedVersionJson'));
      }
      $scope.loadData();
    })
    
    

    

    // Uygulama dilinin belirlenmesi
   
    if (!$scope.language || !$scope.diller ) {
      localStorage.setItem('language', "TR");
      $scope.language = localStorage.getItem('language');
      localStorage.removeItem('dillerJson');
      var ServiceRequest = {
        service_type: "diller",
        language: localStorage.getItem('language')
      }

      $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
        localStorage.setItem('dillerJson', JSON.stringify(data));
        $scope.diller = JSON.parse(localStorage.getItem('dillerJson'));
      })
    };
   
    

    // Login Durum Kontrol düzeltme

    $scope.loadData = function (){

    

      if ($scope.loginStatus != 1) {

        location.href = "#/login";

      } else {

        // Çağrılacak servisler:

        if ((!$scope.hikayeler || ($scope.savedVersions[1].TABLE_VERSION != $scope.versions[1].TABLE_VERSION)) && $scope.loginStatus == 1) {
          localStorage.removeItem('hikayeJson');
          var ServiceRequest = {
            service_type: "hikayeler",
            language: localStorage.getItem('language')
          }

          // Yeni user isteği post edilir ve veritabanına eklenir.
          $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            localStorage.setItem('hikayeJson', JSON.stringify(data));
            $scope.hikayeler = JSON.parse(localStorage.getItem('hikayeJson'));
          })
          localStorage.removeItem('savedVersionJson');
        }

        if ((!$scope.hizmetler || ($scope.savedVersions[2].TABLE_VERSION != $scope.versions[2].TABLE_VERSION)) && $scope.loginStatus == 1) {
          localStorage.removeItem('hizmetJson');
          var ServiceRequest = {
            service_type: "hizmetler",
            language: localStorage.getItem('language')
          }

          // Yeni user isteği post edilir ve veritabanına eklenir.
          $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            localStorage.setItem('hizmetJson', JSON.stringify(data));
            $scope.hizmetler = JSON.parse(localStorage.getItem('hizmetJson'));
          })
          localStorage.removeItem('savedVersionJson');
        }

        if ((!$scope.ekip || ($scope.savedVersions[3].TABLE_VERSION != $scope.versions[3].TABLE_VERSION)) && $scope.loginStatus == 1) {
          localStorage.removeItem('ekipJson');
          var ServiceRequest = {
            service_type: "ekip",
            language: localStorage.getItem('language')
          }

          // Yeni user isteği post edilir ve veritabanına eklenir.
          $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            localStorage.setItem('ekipJson', JSON.stringify(data));
            $scope.ekip = JSON.parse(localStorage.getItem('ekipJson'));
          })
          localStorage.removeItem('savedVersionJson');
        }

        if ((!$scope.referanslar || ($scope.savedVersions[4].TABLE_VERSION != $scope.versions[4].TABLE_VERSION)) && $scope.loginStatus == 1) {
          localStorage.removeItem('referansJson');
          var ServiceRequest = {
            service_type: "referanslar",
            language: localStorage.getItem('language')
          }

          // Yeni user isteği post edilir ve veritabanına eklenir.
          $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            localStorage.setItem('referansJson', JSON.stringify(data));
            $scope.referanslar = JSON.parse(localStorage.getItem('referansJson'));
          })
          localStorage.removeItem('savedVersionJson');
        }

        if ((!$scope.egitimler || ($scope.savedVersions[6].TABLE_VERSION != $scope.versions[6].TABLE_VERSION)) && $scope.loginStatus == 1) {
          localStorage.removeItem('egitimJson');
          var ServiceRequest = {
            service_type: "egitimler",
            language: localStorage.getItem('language')
          }

          // Yeni user isteği post edilir ve veritabanına eklenir.
          $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            localStorage.setItem('egitimJson', JSON.stringify(data));
            $scope.egitimler = JSON.parse(localStorage.getItem('egitimJson'));
          })
          localStorage.removeItem('savedVersionJson');
        }


        if ((!$scope.sozluk || ($scope.savedVersions[5].TABLE_VERSION != $scope.versions[5].TABLE_VERSION)) && $scope.loginStatus == 1) {
          localStorage.removeItem('sozlukJson');
          var ServiceRequest = {
            service_type: "sozluk",
            user_id: localStorage.getItem('user_id')
          }

          // Yeni user isteği post edilir ve veritabanına eklenir.
          $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            localStorage.setItem('sozlukJson', JSON.stringify(data));
            $scope.sozluk = JSON.parse(localStorage.getItem('sozlukJson'));
          })
          localStorage.removeItem('savedVersionJson');
        }

        /*
        if ((!$scope.iletisim || ($scope.savedVersions != $scope.versions)) && $scope.loginStatus == 1) {
          localStorage.removeItem('iletisimJson');
          var ServiceRequest = {
            service_type: "iletisim",
            user_id: localStorage.getItem('user_id')
          }

          // Yeni user isteği post edilir ve veritabanına eklenir.
          $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            localStorage.setItem('iletisimJson', JSON.stringify(data));
            $scope.iletisim = JSON.parse(localStorage.getItem('iletisimJson'));
          })
          localStorage.removeItem('savedVersionJson');
        }
        */

        
        if (!$scope.profil  && $scope.loginStatus == 1) {
          localStorage.removeItem('profilJson');
          var ServiceRequest = {
              service_type: "profil",
              language: localStorage.getItem('language'),
              user_id: $scope.userId
          }

          // Yeni user isteği post edilir ve veritabanına eklenir.
          $http.post($rootScope.webServiceUrl, ServiceRequest).success(function(data) {
              localStorage.setItem('profilJson', JSON.stringify(data));
              $scope.profil = JSON.parse(localStorage.getItem('profilJson'));

          // Kullanıcı tipi belirlenir.
              if ($scope.profil[0].USER_TYPE == "admin") {
                localStorage.setItem('isAdmin', 1);
                $scope.isAdmin = localStorage.getItem('isAdmin');
              } else {
                localStorage.setItem('isAdmin', 0);
                $scope.isAdmin = localStorage.getItem('isAdmin');
              }
          })
          localStorage.removeItem('savedVersionJson');
        }
        
         
        location.href = "#/tab/main";
      }
    }
    


    
    $scope.tiklabayrak = function (language) {

      localStorage.setItem('languageOld', $scope.language);
      $scope.languageOld = localStorage.getItem('languageOld');
      localStorage.setItem('language', language);
      $scope.language = localStorage.getItem('language')
      if ($scope.languageOld != $scope.language) {
        localStorage.removeItem('dillerJson')
        var ServiceRequest = {
          service_type: "diller",
          language: localStorage.getItem('language')
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('dillerJson', JSON.stringify(data));
          $scope.diller = JSON.parse(localStorage.getItem('dillerJson'));
        })
      }
      console.log(language);
    };

    // Kullanıcı girişi, Kullanıcı kaydı, Şifre yenileme Switch Algoritması

    $scope.kayitButon = function (kayittab) {
      $scope.kayittab = kayittab;
      console.log($scope.kayittab);
    };

    //Kullanıcı Giriş Fonksiyonu

    $scope.doLogin = function () {

      // post edilecek ServiceRequest isimli değişken tanımlanır,
      var ServiceRequest = {
        service_type: "giris",
        email: $scope.loginData.email,
        sifre: $scope.loginData.password,
        language: localStorage.getItem('language')
      }

      // Service request değişkeni web service post edilir. Gelen yanıt $scope.giris isimli değişkene atanır.
      $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
        $scope.giris = data[0]

        //Gelen veriler girlenler ile uyuşuyorsa kullanıcı ismi ve maili lokale kaydedilir.
        if ($scope.giris.login_status == true) {

          localStorage.setItem('user_id', $scope.giris.id);
          localStorage.setItem('loginStatus', 1);
          $scope.loginStatus = localStorage.getItem('loginStatus');
          $scope.userId = localStorage.getItem('user_id');
          console.log ($scope.userId);
          $scope.loadData();

          // Kaydedilen bilgiler uygulamanın ilgili kısımlarında gösterilmek üzere kullanılır.
          $ionicPopup.alert({ template: "Sn. " + $scope.giris.user_name + ", Operics'e hoşgeldiniz!.." });
          console.log("Login Status = " + $scope.loginStatus);
          

        } else {

          $ionicPopup.alert({ template: $scope.giris.error_message });
          console.log("Login Status = " + $scope.loginStatus);
        };
      })
    };

    // Kullanıcı Kayıt Fonksiyonu

    $scope.registerUser = function () {
      
      var ServiceRequest = {
        service_type: "create_user",
        photo: "img/pp.jfif",
        name: $scope.kayitData.name,
        phone: $scope.kayitData.number,
        email: $scope.kayitData.email,
        sifre: $scope.kayitData.password
      }

      // Service request değişkeni web service post edilir. Gelen yanıt $scope.kullanici isimli değişkene atanır.
      $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
        $scope.kullanici = data[0]
        localStorage.setItem('user_id', $scope.kullanici.user_id)

        if ($scope.kullanici.create_status == 1 ) {
          $ionicModal.fromTemplateUrl('templates/sms.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        }
      })

    };

    // Kullanıcı Şifre Yenileme

    $scope.passwordRes = function () {
      
      var ServiceRequest = {
        service_type: "pass_res",
        email: $scope.resetPass.email
      }

      // Service request değişkeni web service post edilir. Gelen yanıt $scope.kullanici isimli değişkene atanır.
      $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
      })

    };
    
    // Sms Onay

    $scope.smsOnay = function () {
      $scope.userId = localStorage.getItem('user_id');
      var ServiceRequest = {
        service_type: "sms_verify",
        user_id: $scope.userId,
        sms_code: $scope.smsVerify.kod1 + $scope.smsVerify.kod2 + $scope.smsVerify.kod3 + $scope.smsVerify.kod4
      }
      console.log(ServiceRequest);

      $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
        $scope.sms_verify = data[0]
        if ($scope.sms_verify.create_status == "true") {
          localStorage.setItem('loginStatus', 1);
          $scope.loginStatus = localStorage.getItem('loginStatus');
          $scope.loadData(); 
          $scope.modal.hide();
          console.log($scope.loginStatus);
        }
      })
    }

    $scope.moveToNext = function  (field1, maxlength, field2) {
      if (document.getElementById(field1).length == maxlength) {
        document.getElementById(field2).focus();
      }
    }
    

    //Logout işlemi

    $scope.cikis = function () {
      localStorage.removeItem('language');
      localStorage.removeItem('user_id');
      $scope.userId = localStorage.getItem('user_id');
    }

    // Profil resmi için kamera kontrolcüsü

    $scope.takePP = function () {
      var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.JPEG
      }
      $cordovaCamera.getPicture({})
        .then(function (imageData) {
          console.log('camera data: ' + angular.toJson(imageData));
          $scope.pictureUrl = 'data:image/jpeg;base64,' + imageData;
        }, function (error) {
          console.log('camera error: ' + angular.toJson(imageData))
        })
    };

    $scope.tiklaab = function (abouttab) {
      console.log(abouttab);
      $scope.abouttab = abouttab;
    };

  
    //Favoriye ekleme
    $scope.FavKontrol = function (kelime_id, kullanici_id) {
      console.log(kelime_id, kullanici_id);
    };

    

    $scope.text_truncate = function (str, length, ending) {
      if (length == null) {
        length = 100;
      }
      if (ending == null) {
        ending = '...';
      }
      if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
      } else {
          return str;
      }
    }

    // Onay kutusu
    $scope.ConfirmApplication = function () {

      var confirmPopup = $ionicPopup.alert({
        title: "Başarılı",
        template: "Sn. Ahmet Yılmaz " + $scope.egitimler[$scope.itemId].CRS_NAME + " için ön başvurunuz alınmıuştır. En kısa sürede sizinle iritibata geçilecektir."
      });

      confirmPopup.then(function (res) {
        if (res) {
          $scope.aktifmi = true;
          var ServiceRequest = {
            service_type: "kursa_katil",
            user_id: $scope.userId,
            course_id: $scope.itemId
          }

          $http.post($rootScope.webServiceUrl, ServiceRequest)
        }
      });
    };

    // A confirm dialog

    $scope.CancelApplication = function () {
      var confirmPopup = $ionicPopup.alert({
        title: "İptal Edildi",
        template: "İptal onaylanmıştır."
      });

      confirmPopup.then(function (res) {
        if (res) {
          $scope.aktifmi = false;
          var ServiceRequest = {
            service_type: "kursu_iptal_et",
            user_id: "3",
            course_id: "2"
          }

          $http.post($rootScope.webServiceUrl, ServiceRequest)
          }
      });
    };



    //Detay sayfası filtreleme algoritması

    $scope.modalgosterici = function (tur, id) {
      $scope.itemId = id;

      switch (tur) {

        case 'service':
          $ionicModal.fromTemplateUrl('templates/service-detail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'course':
          $ionicModal.fromTemplateUrl('templates/course-detail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          })
          break;

        case 'story':
          $ionicModal.fromTemplateUrl('templates/story-detail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'profile':
          $ionicModal.fromTemplateUrl('templates/profile-detail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'team':
          $ionicModal.fromTemplateUrl('templates/team-detail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'dictionary':
          $ionicModal.fromTemplateUrl('templates/dictionary-detail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;
      }
    };

    //Admin İçerik Düzenleme arayüzlerine erişim

    $scope.editgosterici = function (tur, editFlag) {

      $scope.editFg = editFlag;
      
      if ($scope.editFg == 1) {
        $scope.modal.hide();
        $scope.inputField.name      = $scope.editInput.name;
        $scope.inputField.position  = $scope.editInput.position;
        $scope.inputField.link      = $scope.editInput.link;
        $scope.inputField.img       = $scope.editInput.img;
        $scope.inputField.head      = $scope.editInput.head;
        $scope.inputField.desc      = $scope.editInput.desc;
        $scope.inputField.detDesc   = $scope.editInput.detDesc;
        $scope.inputField.hour      = $scope.editInput.hour;
        $scope.inputField.address   = $scope.editInput.address;
        $scope.inputField.bgdate    = $scope.editInput.bgdate;
        $scope.inputField.enddate   = $scope.editInput.enddate;
      } else {
        $scope.inputField.name      = null;
        $scope.inputField.position  = null;
        $scope.inputField.link      = null; 
        $scope.inputField.img       = null;
        $scope.inputField.head      = null;
        $scope.inputField.desc      = null;
        $scope.inputField.detDesc   = null;
        $scope.inputField.hour      = null;
        $scope.inputField.address   = null;
        $scope.inputField.bgdate    = null;
        $scope.inputField.enddate   = null;
      }

      switch (tur) {

        case 'editAbout':
          if ($scope.abouttab == 1) {
            $ionicModal.fromTemplateUrl('templates/add-reference.html', { scope: $scope }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
            });
          } else if ($scope.abouttab == 2) {
            $ionicModal.fromTemplateUrl('templates/add-teams.html', { scope: $scope }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
            });
          } else {
            $ionicModal.fromTemplateUrl('templates/add-service.html', { scope: $scope }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
            });
          }
          break;

        case 'editCourse':
          $ionicModal.fromTemplateUrl('templates/add-course.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editStory':
          if ($scope.editFg == 0) {
            $scope.modal.hide();
          }
          $ionicModal.fromTemplateUrl('templates/add-story.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editProfile':
          $ionicModal.fromTemplateUrl('templates/profile-detail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editTeam':
          $ionicModal.fromTemplateUrl('templates/add-teams.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editDic':
          $ionicModal.fromTemplateUrl('templates/add-dictionary.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editCon':
          $ionicModal.fromTemplateUrl('templates/add-contact.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'listUsers':
          $ionicModal.fromTemplateUrl('templates/list-users.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;
      }

      console.log($scope.editFg);

    };

    $scope.applyButton = function(tur, islem) {
     switch (tur) {
      case 'team':
        switch (islem) {
          case 'ekle':
            var ServiceRequest = {
              service_type: "calisan_ekle",
              team_name:      $scope.inputField.name,
              team_position:  $scope.inputField.position,
              team_about:     $scope.inputField.desc,
              team_linkedin:  $scope.inputField.link,
              team_image:     "img/profile.jpg"  
            }

            // Service request değişkeni web service post edilir. Gelen yanıt $scope.kullanici isimli değişkene atanır.
            $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            })
            localStorage.removeItem('ekipJson');
            $scope.ekip = JSON.parse(localStorage.getItem('ekipJson'));
            $scope.loadData();
            console.log("ekledi");
            $scope.modal.hide();
            break;

          case 'guncelle':
            var ServiceRequest = {
              service_type: "calisan_guncelle",
              team_id:        $scope.editInput.itemID,
              team_name:      $scope.inputField.name,
              team_position:  $scope.inputField.position,
              team_about:     $scope.inputField.desc,
              team_linkedin:  $scope.inputField.link,
              team_image:     "img/profile.jpg"  
            }

            // Service request değişkeni web service post edilir. Gelen yanıt $scope.kullanici isimli değişkene atanır.
            $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            })
            localStorage.removeItem('ekipJson');
            $scope.ekip = JSON.parse(localStorage.getItem('ekipJson'));
            $scope.loadData();
            console.log("guncelledi");
            $scope.modal.hide();
            break;

          case 'sil':
            var ServiceRequest = {
              service_type: "calisan_sil",
              team_id:        $scope.editInput.itemID
            }

            // Service request değişkeni web service post edilir. Gelen yanıt $scope.kullanici isimli değişkene atanır.
            $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
            })
            localStorage.removeItem('ekipJson');
            $scope.ekip = JSON.parse(localStorage.getItem('ekipJson'));
            $scope.loadData();
            console.log("silindi");
            $scope.modal.hide();
            break;
        }
        break;
     }
    };
  });

