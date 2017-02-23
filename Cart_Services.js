angular.module('services.cart', [])
    .service('Cart', ['$rootScope', 'Reviewer', function ($rootScope, Reviewer) {
    	
    	var itemsinCart = JSON.parse(localStorage.getItem('cart') || '{}');
        var getCart = function(){
        	return JSON.parse(localStorage.getItem('cart'));
        };

        var addItem = function(id, quantity) {
        	      if(typeof id === "undefined" || id === null)
        	        alert("item id is invalid");

        	      if(itemsinCart.hasOwnProperty(id))
        	        alert("the item id " + id + " already exists");

        	      if(typeof quantity === "undefined" || quantity === null || quantity <= 0)
        	        alert("the quantity " + quantity + " is invalid");

        	      itemsinCart[id] = {id:id, quantity:quantity};
        	      this.save();
        	    
        };

     

        var addItems = function(items) {
          if(typeof items === "undefined" || items === null)
            alert("no items to add");

          

          for(var i = 0; i < items.length; i++)
            this.addItem(items[i].id, items[i].quantity);
        };

        var save = function() {
            var self = this;

            Reviewer.review(this.getCart()).then(function(data) {
              self.persist();
              self.refresh();
            },
            function(errorMsg) {
              alert("Cart Service save error " + errorMsg);
            });
          };

     // remove item from cart

        var remove = function (id) {
          if(typeof id === "undefined" || id === null)
            alert("item id is not valid");

          if(itemsinCart.hasOwnProperty(id)) {
            delete itemsinCart[id];
            this.save();
          } else {
            alert("the item id " + id + " doesn't exist");
          }
        };

        var clear = function() {
            if(Object.keys(itemsinCart).length == 0){
                alert("Cart already empty!");
            }
            else{
            	itemsinCart = {};
                this.save();
            }
        };

        var persist = function() {
            localStorage.setItem('cart', JSON.stringify(itemsinCart));
        };

        var changeQuantity = function (id, quantity) {
            if(typeof id === "undefined" || id === null)
              alert("item id is not valid");

            if(!itemsinCart.hasOwnProperty(id))
              alert("the id " + id + " doesn't exist");

            if(typeof quantity === "undefined" || quantity === null)
              alert("the quantity " + quantity + " is not valid");

           
            if(quantity === 0) {
              this.remove(id);
            } else {
            	itemsinCart[id].quantity = quantity;
              this.save();
            }
          };

          var refresh = function() {
              $rootScope.$broadcast('cart_Refresh');
          };
          
          return {
              getCart: getCart,
              addItem: addItem,
              addItems: addItems,
              save: save,
              persist: persist,
              remove: remove,
              clear: clear,
              changeQuantity: changeQuantity,
              refresh: refresh
            };
    }]);

.service('Reviewer', function($reviewCart, $timeout){
    this.review = function(cart){
        var deferred = $reviewCart.defer();
        $timeout(function(){
            var lsCart = JSON.parse(localStorage.getItem('cart'));
            if(lsCart)
            {
                if(cart.length !== Object.keys(lsCart).length){
                    deferred.resolve();
                }
                else
                {
                    cart.forEach(function(key){
                        if(lsCart[key.id] && lsCart[key.id].quantity !== key.quantity) deferred.resolve();
                    });

                    deferred.reject("Persist failed!");
                }
            }
            else
            {
                deferred.resolve();
            }
        }, 100);
        return deferred.promise;
    };
});