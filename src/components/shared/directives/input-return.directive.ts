export function inputReturn( $window ) {
  const ENTER = 13;
  const TAB = 9;


  let onEnterPressed = ( $scope: any, value: string ) => {
    if ( $scope.vm.onEnterPressed ) {
      $scope.vm.onEnterPressed( value );
    }
    if ( $window.cordova && $window.cordova.plugins.Keyboard && $window.cordova.plugins.Keyboard.isVisible ) {
      $window.cordova.plugins.Keyboard.close();
    }
  };

  return {
    restrict: 'A',
    link: function linkFn( $scope, $elem, $attrs ) {
      $elem.on( 'keyup', function ( event ) {
        if ( event.keyCode === ENTER ) {
          onEnterPressed( $scope, event.target.value );
        }
      });

      $elem.on( 'keydown', function ( event ) {
        if ( $scope.isAndroid && $attrs.type === 'number' && event.keyCode === TAB ) {
          onEnterPressed( $scope, event.target.value );
        }
      });
    }
  };
}

inputReturn.$inject = [ '$window' ];
