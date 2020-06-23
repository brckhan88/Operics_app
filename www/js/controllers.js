angular.module('starter.controllers', [])

  .controller('MainCtrl', function ($scope, $state, $rootScope, $stateParams, $ionicModal, $http, $ionicPopup, $cordovaCamera) {

    $rootScope.webServiceUrl = "http://www.microwebservice.net/operics_web/webservice.php";
    $scope.pictureUrl = "http://placehold.it/200x200";


    /*
    

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
    }*/


  


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
    $scope.userList                     = JSON.parse(localStorage.getItem('kullanıcıListesiJson'));
    $scope.hikayeler                    = JSON.parse(localStorage.getItem('hikayeJson'));
    $scope.hizmetler                    = JSON.parse(localStorage.getItem('hizmetJson'));
    $scope.ekip                         = JSON.parse(localStorage.getItem('ekipJson'));
    $scope.referanslar                  = JSON.parse(localStorage.getItem('referansJson'));
    $scope.egitimler                    = JSON.parse(localStorage.getItem('egitimJson'));
    $scope.sozluk                       = JSON.parse(localStorage.getItem('sozlukJson'));
    $scope.profil                       = JSON.parse(localStorage.getItem('profilJson'));
     
   
    // Version Kontrolü

    /*$scope.versionChck = function () {
      
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
      })
      
    }*/
    
    

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

    // Verilerin kontrolü ve yüklenmesi
   
    $scope.loadData = function () {
      // Çağrılacak servisler:

      if (!$scope.profil) {
        var ServiceRequest = {
            service_type: "profil",
            language: localStorage.getItem('language'),
            user_id: $scope.userId
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function(data) {
          localStorage.setItem('profilJson', JSON.stringify(data[0]));
          $scope.profil = JSON.parse(localStorage.getItem('profilJson'));
          
          // Kullanıcı tipi belirlenir!.. (MANDATORY)

          if ($scope.profil.USER_TYPE == "admin") {
            localStorage.setItem('isAdmin', 1);
            $scope.isAdmin = localStorage.getItem('isAdmin');
          } else {
            localStorage.setItem('isAdmin', 0);
            $scope.isAdmin = localStorage.getItem('isAdmin');
          }
        })
          
      } 

      if (!$scope.userList && ($scope.isAdmin == 1) ) {
        localStorage.removeItem('kullanıcıListesiJson');
        var ServiceRequest = {
          service_type: "admin_users_detail",
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('kullanıcıListesiJson', JSON.stringify(data));
          $scope.userList = JSON.parse(localStorage.getItem('kullanıcıListesiJson'));
        })    
      }

      if (!$scope.hikayeler ) {
        var ServiceRequest = {
          service_type: "hikayeler",
          language: localStorage.getItem('language')
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('hikayeJson', JSON.stringify(data));
          $scope.hikayeler = JSON.parse(localStorage.getItem('hikayeJson'));
        })
      }

      if (!$scope.hizmetler) {
        var ServiceRequest = {
          service_type: "hizmetler",
          language: localStorage.getItem('language')
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('hizmetJson', JSON.stringify(data));
          $scope.hizmetler = JSON.parse(localStorage.getItem('hizmetJson'));
        })
      }

      if (!$scope.ekip) {
        var ServiceRequest = {
          service_type: "ekip",
          language: localStorage.getItem('language')
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('ekipJson', JSON.stringify(data));
          $scope.ekip = JSON.parse(localStorage.getItem('ekipJson'));
        })
      }

      if (!$scope.referanslar) {
        var ServiceRequest = {
          service_type: "referanslar",
          language: localStorage.getItem('language')
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('referansJson', JSON.stringify(data));
          $scope.referanslar = JSON.parse(localStorage.getItem('referansJson'));
        })
      }

      if (!$scope.egitimler) {
        var ServiceRequest = {
          service_type: "egitimler",
          language: localStorage.getItem('language')
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('egitimJson', JSON.stringify(data));
          $scope.egitimler = JSON.parse(localStorage.getItem('egitimJson'));
        })
      }

      if (!$scope.sozluk) {
        var ServiceRequest = {
          service_type: "sozluk",
          user_id: localStorage.getItem('user_id')
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('sozlukJson', JSON.stringify(data));
          $scope.sozluk = JSON.parse(localStorage.getItem('sozlukJson'));
        })
      }

      /*
      if (!$scope.iletisim || ($scope.savedVersions != $scope.versions)) {
        var ServiceRequest = {
          service_type: "iletisim",
          user_id: localStorage.getItem('user_id')
        }

        $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
          localStorage.setItem('iletisimJson', JSON.stringify(data));
          $scope.iletisim = JSON.parse(localStorage.getItem('iletisimJson'));
        }) 
      }
      */
    }

    // Login Durum Kontrolcüsü

    $scope.isLogged = function () {
      if ($scope.loginStatus != 1) {

        location.href = "#/login";

      } else {
        $scope.loadData();

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
          $scope.userId = localStorage.getItem('user_id');
          $scope.loginStatus = localStorage.getItem('loginStatus');
          $scope.loadData();
          
          // Kaydedilen bilgiler uygulamanın ilgili kısımlarında gösterilmek üzere kullanılır.
          $ionicPopup.alert({ template: "Sn. " + $scope.giris.user_name + ", Operics'e hoşgeldiniz!.." });

          console.log("Login Status = " + $scope.loginStatus);
          location.href = "#/tab/main";

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
        service_type: "reset_password",
        email: $scope.resetPass.email,
        language: localStorage.getItem('language')
      }

      $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {
        $scope.resReq = data[0]
        if ($scope.resReq.is_valid == true) {
          $ionicPopup.alert({ template: $scope.resReq.error_message });
          $scope.kayitButon(0);

        } else {

          $ionicPopup.alert({ template: $scope.resReq.error_message });
        };
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
    $scope.changePP = function () {
      $ionicActionSheet.show({
        titleText: '',
        buttons: [
        {text:'<i class="icon ion-camera"></i> Camera'},
        {text:'<i class="icon ion-images"></i> Gallery'},
        ],
        cancelText: 'Cancel',
        cancel: function() {
          console.log('CANCELLED');
        },
        buttonClicked: function(index) {
          console.log('BUTTON CLICKED', index);
          if (index==0) {
            $scope.takePP();
            return true;
          } else {
            $scope.galleryPP();
            return true;
          }
        } 
      });
    };

    //Kameradan Fotoğraf Yakalamak İçin
    $scope.takePP = function () {
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight:500,
        allowEdit: true,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.profileImage = "data: image/jpeg;base64," + imageData;},function(err) {
          console.log('Failed because:');
          console.log(err);
      });
    };


    //Albümden Fotoğraf Yakalamak İçin
    $scope.galleryPP = function () {
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 500,
        targetHeight:500,
        allowEdit: true,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.profileImage = "data: image/jpeg;base64," + imageData;},function(err) {
          console.log('Failed because:');
          console.log(err);
      });
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

    $scope.wait =function (ms) {
      var start = new Date().getTime();
      var end = start;
      while(end < start + ms) {
        end = new Date().getTime();
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

    $scope.editLang = function (language) {
      $scope.icerikLang = language;
      console.log(language);
    };




    $scope.editgosterici = function (tur, editFlag) {

      $scope.editFg = editFlag;
      
      if ($scope.editFg == 1) {
        
        $scope.inputField.name      = $scope.editInput.name;
        $scope.inputField.position  = $scope.editInput.position;
        $scope.inputField.link      = $scope.editInput.link;
        $scope.inputField.img       = $scope.editInput.img;
        $scope.inputField.head      = $scope.editInput.head;
        $scope.inputField.desc      = $scope.editInput.desc;
        $scope.inputField.city      = $scope.editInput.city;
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
        $scope.inputField.city      = null;
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
            if ($scope.editFg == 1) {
              $scope.modal.hide();
            }
            $ionicModal.fromTemplateUrl('templates/add-teams.html', { scope: $scope }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
            });
          } else {
            if ($scope.editFg == 1) {
              $scope.modal.hide();
            }
            $ionicModal.fromTemplateUrl('templates/add-service.html', { scope: $scope }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
            });
          }
          break;

        case 'editCourse':
          if ($scope.editFg == 1) {
            $scope.modal.hide();
          }
          $ionicModal.fromTemplateUrl('templates/add-course.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editStory':
          $scope.modal.hide();
      
          $ionicModal.fromTemplateUrl('templates/add-story.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editProfile':
          if ($scope.editFg == 1) {
            $scope.modal.hide();
          }
          $ionicModal.fromTemplateUrl('templates/profile-detail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editTeam':
          if ($scope.editFg == 1) {
            $scope.modal.hide();
          }
          $ionicModal.fromTemplateUrl('templates/add-teams.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editDic':
          if ($scope.editFg == 1) {
            $scope.modal.hide();
          }
          $ionicModal.fromTemplateUrl('templates/add-dictionary.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
          break;

        case 'editCon':
          if ($scope.editFg == 1) {
            $scope.modal.hide();
          }
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
        case 'stories':
          switch (islem) {
            case 'ekle':
              var ServiceRequest = {
                service_type       :               "story_ekle",
                language           :               $scope.icerikLang,
                story_image        :               $scope.inputField.img,
                story_head         :               $scope.inputField.head,
                story_about        :               $scope.inputField.desc  
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('hikayeJson');
              $scope.hikayeler = JSON.parse(localStorage.getItem('hikayeJson'));
              $scope.loadData();
              console.log("Hikaye eklendi");
              $scope.modal.hide();
              break;

            case 'guncelle':
              var ServiceRequest = {
                service_type       :               "story_guncelle",
                story_id           :               $scope.editInput.itemID,
                story_image        :               $scope.inputField.img,
                story_head         :               $scope.inputField.head,
                story_about        :               $scope.inputField.desc   
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('hikayeJson');
              $scope.hikayeler = JSON.parse(localStorage.getItem('hikayeJson'));
              $scope.loadData();
              console.log("Hikaye güncellendi");
              $scope.modal.hide();
              break;

            case 'sil':
              var ServiceRequest = {
                service_type       :               "story_sil",
                story_id           :               $scope.editInput.itemID
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('hikayeJson');
              $scope.hikayeler = JSON.parse(localStorage.getItem('hikayeJson'));
              $scope.loadData();
              console.log("Hikaye silindi");
              $scope.modal.hide();
              break;
          }
          break;

        case 'services':
          switch (islem) {
            case 'ekle':
              var ServiceRequest = {
                service_type       :               "hizmet_ekle",
                service_image      :               $scope.inputField.img,  
                service_name       :               $scope.inputField.name,
                service_description:               $scope.inputField.desc
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
            localStorage.removeItem('hizmetJson');
            $scope.hizmetler = JSON.parse(localStorage.getItem('hizmetJson'));
            $scope.loadData();
            console.log("Hizmet eklendi");
            $scope.modal.hide();
            break;

            case 'guncelle':
              var ServiceRequest = {
                service_type       :               "hizmet_guncelle",
                service_id         :               $scope.editInput.itemID,
                service_image      :               $scope.inputField.img,
                service_name       :               $scope.inputField.name,
                service_description:               $scope.inputField.desc 
              }

        
              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('hizmetJson');
              $scope.hizmetler = JSON.parse(localStorage.getItem('hizmetJson'));
              $scope.loadData();
              console.log("Hizmet güncellendi");
              $scope.modal.hide();
              break;

            case 'sil':
              var ServiceRequest = {
                service_type       :               "hizmet_sil",
                service_id         :               $scope.editInput.itemID
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('hizmetJson');
              $scope.hizmetler = JSON.parse(localStorage.getItem('hizmetJson'));
              $scope.loadData();
              console.log("Hizmet silindi");
              $scope.modal.hide();
              break;
          }
          break;

        case 'references':
          switch (islem) {
            case 'ekle':
              var ServiceRequest = {
                service_type       :               "referans_ekle",
                reference_image    :               $scope.inputField.img,
                reference_name     :               $scope.inputField.name
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('referansJson');
              $scope.referanslar = JSON.parse(localStorage.getItem('referansJson'));
              $scope.loadData();
              console.log("Referans eklendi");
              $scope.modal.hide();
              break;

            case 'guncelle':
              var ServiceRequest = {
                service_type       :               "referans_guncelle",
                reference_id       :               $scope.editInput.itemID,
                reference_image    :               $scope.inputField.img,
                reference_name     :               $scope.inputField.name 
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('referansJson');
              $scope.referanslar = JSON.parse(localStorage.getItem('referansJson'));
              $scope.loadData();
              console.log("Referans güncellendi");
              $scope.modal.hide();
              break;

            case 'sil':
              var ServiceRequest = {
                service_type       :               "referans_sil",
                reference_id       :               $scope.editInput.itemID
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('referansJson');
              $scope.referanslar = JSON.parse(localStorage.getItem('referansJson'));
              $scope.loadData();
              console.log("Referans silindi");
              $scope.modal.hide();
              break;
          }
          break;

        case 'team':
          switch (islem) {
            case 'ekle':
              var ServiceRequest = {
                service_type       :               "calisan_ekle",
                team_name          :               $scope.inputField.name,
                team_position      :               $scope.inputField.position,
                team_about         :               $scope.inputField.desc,
                team_linkedin      :               $scope.inputField.link,
                team_image         :               "img/profile.jpg"  
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('ekipJson');
              $scope.ekip = JSON.parse(localStorage.getItem('ekipJson'));
              $scope.loadData();
              console.log("Çalışan ekledi");
              $scope.modal.hide();
              break;

            case 'guncelle':
              var ServiceRequest = {
                service_type       :               "calisan_guncelle",
                team_id            :               $scope.editInput.itemID,
                team_name          :               $scope.inputField.name,
                team_position      :               $scope.inputField.position,
                team_about         :               $scope.inputField.desc,
                team_linkedin      :               $scope.inputField.link,
                team_image         :               "img/team/3.png"  
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('ekipJson');
              $scope.ekip = JSON.parse(localStorage.getItem('ekipJson'));
              $scope.loadData();
              console.log("Çalışan guncelledi");
              $scope.modal.hide();
              break;

            case 'sil':
              var ServiceRequest = {
                service_type       :               "calisan_sil",
                team_id            :               $scope.editInput.itemID
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('ekipJson');
              $scope.ekip = JSON.parse(localStorage.getItem('ekipJson'));
              $scope.loadData();
              console.log("Çalışan silindi");
              $scope.modal.hide();
              break;
          }
          break;

        case 'courses':
          switch (islem) {
            case 'ekle':
              var ServiceRequest = {
                service_type       :               "egitim_ekle",
                course_image       :               $scope.inputField.img,
                course_name        :               $scope.inputField.head,
                course_description :               $scope.inputField.desc,
                course_city        :               $scope.inputField.city,
                course_hour        :               $scope.inputField.hour,
                course_adress      :               $scope.inputField.address,
                course_bgdate      :               $scope.inputField.bgdate,
                course_endate      :               $scope.inputField.enddate
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('egitimJson');
              $scope.egitimler = JSON.parse(localStorage.getItem('egitimJson'));
              $scope.loadData();
              console.log("Egitim eklendi");
              $scope.modal.hide();
              break;

            case 'guncelle':
              var ServiceRequest = {
                service_type       :               "egitim_guncelle",
                course_id          :               $scope.editInput.itemID,
                course_image       :               $scope.inputField.img,
                course_name        :               $scope.inputField.head,
                course_description :               $scope.inputField.desc,
                course_city        :               $scope.inputField.city,
                course_hour        :               $scope.inputField.hour,
                course_adress      :               $scope.inputField.address,
                course_bgdate      :               $scope.inputField.bgdate,
                course_endate      :               $scope.inputField.enddate
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('egitimJson');
              $scope.egitimler = JSON.parse(localStorage.getItem('egitimJson'));
              $scope.loadData();
              console.log("Egitim güncellendi");
              scope.modal.hide();
              break;

            case 'sil':
              var ServiceRequest = {
                service_type       :               "egitim_sil",
                course_id          :               $scope.editInput.itemID
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('egitimJson');
              $scope.egitimler = JSON.parse(localStorage.getItem('egitimJson'));
              $scope.loadData();
              console.log("Egitim silindi");
              $scope.modal.hide();
              break;
          }
          break;

        case 'dictionary':
          switch (islem) {
            case 'ekle':
              var ServiceRequest = {
                service_type       :                 "kelime_ekle",
                word_name          :                 $scope.inputField.name,
                word_description   :                 $scope.inputField.desc 
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('sozlukJson');
              $scope.sozluk = JSON.parse(localStorage.getItem('sozlukJson'));
              $scope.loadData();
              console.log("Sozluk eklendi");
              $scope.modal.hide();
              break;

            case 'guncelle':
              var ServiceRequest = {
                service_type       :                  "kelime_guncelle",
                word_id            :                  $scope.editInput.itemID,
                word_name          :                  $scope.inputField.name,
                word_description   :                  $scope.inputField.desc
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('sozlukJson');
              $scope.sozluk = JSON.parse(localStorage.getItem('sozlukJson'));
              $scope.loadData();
              console.log("Sozluk güncellendi");
              $scope.modal.hide();
              break;

            case 'sil':
              var ServiceRequest = {
                service_type       :                  "kelime_sil",
                word_id            :                  $scope.editInput.itemID
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              localStorage.removeItem('sozlukJson');
              $scope.sozluk = JSON.parse(localStorage.getItem('sozlukJson'));
              $scope.loadData();
              console.log("Sozluk silindi");
              $scope.modal.hide();
              break;
          }
          break;

        case 'contact':
          switch (islem) {
            case 'ekle':
              var ServiceRequest = {
                service_type: "",
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              $scope.iletisim= null;
              $scope.loadData();
              console.log("... eklendi");
              $scope.modal.hide();
              break;

            case 'guncelle':
              var ServiceRequest = {
                service_type: "",
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              $scope.iletisim = null;
              $scope.loadData();
              console.log("... güncellendi");
              $scope.modal.hide();
              break;

            case 'sil':
              var ServiceRequest = {
                service_type: "",
                team_id:        $scope.editInput.itemID
              }

              $http.post($rootScope.webServiceUrl, ServiceRequest).success(function (data) {})
              $scope.iletisim = null;
              $scope.loadData();
              console.log("... silindi");
              $scope.modal.hide();
              break;
          }
          break;
      }
    };


    $scope.isLogged();


  });

