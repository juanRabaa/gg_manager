( function( $ ) {

	$(".not-collapse").on("click", function(e) { e.stopPropagation(); });

	$(document).ready(function(){
		setTimeout(function(){
			$(".products-list").sortable({
				update: function(event, ui) {
					var $item = ui.item;
				},
				stop: function( event, ui ){
					var $item = ui.item;
				},
				start: function( event, ui ){
					var $item = ui.item;
				},
			});
		}, 1)

		/*Add new item*/
		$(document).on('click', '.add-new-button', function(){
			addNewItem( $(this).closest('#gg-page-creator-content') );
		});

		/*Remove item*/
		$(document).on('click', '.delete-product', function(){
			deleteItem( $(this).closest('li') );
		});
	})

	function deleteItem( $item ){
		if ( confirm("¿Está seguro?") )
			$item.remove();
	}

	function addNewItem( $pageCreatorContent ){
		var newItem = '<li class="sortable-li product-item"><i class="fas fa-pencil-alt edit-product" title="Edit"></i><span class="item-name"></span>'
		+ '<i class="far fa-trash-alt delete-product" title="Delete List"></i></li>';
		console.log(newItem);
		console.log($pageCreatorContent);
		$pageCreatorContent.find(".products-list").append(newItem);
	}

	function updateValue( $textareaGeneratorPanel ){
		var $textAreas = $textareaGeneratorPanel.find("textarea");
		var $valueInput = $textareaGeneratorPanel.find('input[type="hidden"]' );
		var finalValue = {};
		var index = 0;
		$textAreas.each(function( index ){
			finalValue[index] = $(this).val();
			index++;
		});
		//console.log(finalValue);
		$valueInput.val( JSON.stringify(finalValue) ).trigger( 'change' );
	}

} )( jQuery );
