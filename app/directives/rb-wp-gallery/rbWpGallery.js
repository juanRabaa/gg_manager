panelProductos.directive('rbWpGallery', [function() {
  function link($scope, $element, attrs) {
      $scope.label = attrs.rbWpGalleryName ? attrs.rbWpGalleryName : "Image";
      $scope.placeholder = attrs.rbWpGalleryPlaceholder ? attrs.rbWpGalleryPlaceholder : "";
      $scope.onImageChanged = attrs.rbWpGalleryOnImageChange;
      console.log($scope.placeholder);
      $scope.ngModel = $scope.ngModel ? $scope.ngModel : $scope.placeholder;
      $scope.button = attrs.rbWpGalleryButton ? attrs.rbWpGalleryButton : "Choose from gallery";
      $scope.disabled = attrs.disabled != undefined ? true : false;
      $scope.class = "";
      $scope.dragNdrop = {
          status: 'noDrag',

      }

      if ( $scope.disabled )
        $scope.class += "rb-disabled-gallery ";

      $scope.imageChanged = function(){
          if (typeof $scope.onImageChanged === "function")
              $scope.onImageChanged($scope.ngModel);
      }

      $scope.openGallery = function(){
          //console.log("Opening gallery");
          var custom_uploader = wp.media.frames.file_frame = wp.media({
              title: 'Agregar imagen',
              button: {
                  text: 'Agregar imagen',
              },
              multiple: false,
          });
          custom_uploader.on('select', function() {
              var newSrc = custom_uploader.state().get('selection').first().changed.url;
              //console.log("New image: ", newSrc);
              $scope.ngModel = newSrc;
              //console.log($scope.ngModel);
              $scope.imageChanged();
              $scope.$apply();
          });
          custom_uploader.open();
      }

      var counter = 0;

      $(document).on('dragenter', function(){
            $scope.dragPosition = "drag-screen";
      });

      $element.bind({
          dragenter: function(ev) {
              $scope.dragPosition = "drag-element";
          },
          dragover: function(ev) {
              $scope.dragPosition = "drag-element";
          },
          dragleave: function() {
              $scope.dragPosition = "drag-outside";
          },
          drop: function(ev){
              ev.preventDefault();
              console.log(ev);
          },
      });

      /*console.log(1);
      var json = JSON.parse(attrs.rbAttr);
      console.log(json);
      for (var attribute in attrs.rbAttr) {
          if (attrs.rbAttr.attribute) {
              $element.attr(attribute, '');
          }
      }*/
  }

  return {
    scope: {
        ngModel: '=',
    },
    link: link,
    templateUrl: wordpressData.pageCreatorUrl + '/app/directives/rb-wp-gallery/gallery.html',
  };
}]);
