
var buttonCreate = $("#btnCrearUsuario");
var isCreate = false ; 
var ID_PEDIDO = -1 ; 
var ID_PRODUCTO = -1 ;
var TOTAL_PRICE = 0 ; 
var IS_CREATE = true ; 
var id_products = new Array();

$(document).ready(function(){

    instansFunctionsOrderCreate();
    insertButtonCreateOnOrder();
    instanceSelect('.select2IMG')
    showEditOrder();
    onChangeProduct();
    onCloseModal();
    
})

/**
 * Este metodo obtiene el pedido a editar e inserta los datos del pedido 
 * en los inputs además de insertar todos los valores de los productos 
 * en la lista de productos
 * @param {int} id 
 */
function insertDataOrderOnEdit(id){
    $.ajax({
        type: "get",
        url: 'orders/'+id+'/edit',
        data: {_token : $('#token').val(),
            id : id ,
        },
        success: function (response) {
            console.log('entro a success');
            var obj =  JSON.parse(response);
            var products = obj.products ;
            var observation = obj.observation ;
            var table_id = obj.table_id ;
            //Insertando nuevos valores en el array
            
             id_products = new Array();
             
            products.forEach(product => {
                console.log(product.cant);
                var p = new Object();
                p.id = product.id ;
                p.count = product.cant;
                id_products.push(p);
            });
            console.log("Datos anteriores: ",id_products);
            //Reemplazando el array que tiene los valores que se envian al controlador con los obtenidos al editar
            
            TOTAL_PRICE = obj.totalPrice
            
            $('#totalPrice').html('S/.'+TOTAL_PRICE);
            $('#inputObservationProductOrder').val(observation);
            $('#inputTableOrder').val(table_id);
                $('#inputTableOrder').change();
                $('#inputTableOrder').attr('disabled','disabled');
                
            //Insertando datos en la tabla
            insertDataProductsOnEdit(products);
            
            
        },
        error:function(response){
            console.log("error");
        }
    });
}

function onCloseModal(){
    $("#create-order-modal").on("hidden.bs.modal", function () {
        resetData();
        ID_PEDIDO = -1 ; 
        IS_CREATE = true ; 
        TOTAL_PRICE = 0 ;
        $('#inputTableOrder').removeAttr("disabled");
        $('#totalPrice').html('S/.'+0);
        changeTitle('Agregar nuevo pedido');
        changeTitleButton('Generar pedido');
    });
}

function resetData(){
    $('#formAddOrder').find('input').each(function(){
        $(this).val(' ');    
    });
    $('#formAddOrder').find('select').each(function(){
        $(this).val(0); 
        $(this).change();   
    });
    $('#formAddOrder').find('textarea').each(function(){
        $(this).html('') ;    
    });

    $('#table-order tbody').html('');

}
/**
 * Este metodo inserta los datos de los productos en la tabla : lista de pedidos
 * @param {Array} products 
 */
function insertDataProductsOnEdit(products){
    products.forEach(product => {
        insertDataProduct(product.name,product.cant,product.price*product.cant);
    });
}

function showEditOrder(){
    $('.editorder').on('click',function(event){
        changeTitle('Modificar pedido');
        changeTitleButton('Actualizar pedido');
        var id = $(this).data('id');
        ID_PEDIDO = id ; 
        IS_CREATE=false;
        console.log('init show edit');
        insertDataOrderOnEdit(id);
    });
}   

function changeTitle(text){
    $('#modal-order-title').html(text);
}

function changeTitleButton(text){
$('#btnCreateOrderTitle').html(text);
}

function instansFunctionsOrderCreate(){
    console.log('init functions create...');
    showCreateOrder();    
    addOrder();
    addProduct();
  }



function showCreateOrder(){
    $('#create_order').on('click',function(event){
        
        IS_CREATE=true;
        console.log('init show create');
    });
}   


function onChangeProduct(){
    $('#inputProductsOrder').on('change',function(e){
        var id = $(this).val();
        if(id!=0){
            insertDataInformation(id)
            ID_PRODUCTO = id;
        }
        
    })
}

/**
 * Inserta los datos del producto elegido en el selector en los inputs que muestran
 * su información
 * @param {int} id 
 */
function insertDataInformation(id){
    $.ajax({
        type: "post",
        url: "orders/product",
        data: {_token : $('#token').val(),
            id : id ,
        },
        success: function (response) {
            var obj =  JSON.parse(response);
            $('#inputCountProductOrder').val(obj.stock);
            $('#inputCountProduct').attr('max',obj.stock);
            $('#inputDescriptionProduct').html(obj.description);
        },
        error:function(response){
            console.log("error");
        }
    });
}

/**
 * Inserta el objeto producto dentro de un arreglo id_products cada vez que se 
 * agrega productos
 *
 */
function insertProductInformation(){
    var p = new Object();
    $.ajax({
        type: "post",
        url: "orders/product",
        data: {_token : $('#token').val(),
            id : ID_PRODUCTO ,
        },
        success: function (response) {
            var obj =  JSON.parse(response);
                p.id = ID_PRODUCTO;
                p.count = $('#inputCountProduct').val();
            id_products.push(p);
            TOTAL_PRICE = TOTAL_PRICE + (obj.price * $('#inputCountProduct').val());
            $('#totalPrice').html('S/.'+TOTAL_PRICE);
            insertDataProduct(obj.name,$('#inputCountProduct').val(),(obj.price * $('#inputCountProduct').val()) )
            
        },
        error:function(response){
            console.log("error");
        }
    });
}

function addProduct(){
    $('#addProductToOrder').on('click',function (event) { 
        insertProductInformation();
    });
}

function addOrder(){
    $('#btnCrearPedido').on('click',function (event) { 
       if($('#inputTableOrder').val()!=0){
        if(IS_CREATE){
            $.ajax({
                type: "post",
                url: "orders/store",
                data: {_token : $('#token').val(),
                    products : id_products ,
                    totalPrice : TOTAL_PRICE,
                    table: $('#inputTableOrder').val(),
                    observation: $('#inputObservationProductOrder').val(),
                },
                success: function (response) {
                    console.log(response);
                    swal({
                        title: "Operación exitosa !! ",
                        text: "El Pedido ha sido registrado correctamente",
                        type: "success",
                      },function(){
                          console.log("registered order...");
                          location.reload();
                      });
                },
                error:function(response){
                    console.log("error");
                }
            });
        }else{
            console.log("Datos: id:",ID_PEDIDO," - productos: ",id_products,TOTAL_PRICE);
            $.ajax({
                type: "post",
                url: "orders/update",
                data: {_token : $('#token').val(),
                    id : ID_PEDIDO,
                    products : id_products ,
                    totalPrice : TOTAL_PRICE,
                    observation: $('#inputObservationProductOrder').val(),
                },
                success: function (response) {
                    console.log(response);
                    swal({
                        title: "Operación exitosa !! ",
                        text: "El Pedido ha sido registrado correctamente",
                        type: "success",
                      },function(){
                          console.log("registered order...");
                          location.reload();
                      });
                },
                error:function(response){
                    console.log("error");
                }
            });
        }
       }else{
           swal('Operación incorrecta!!','Debe ingresar el número de la mesa','error')
       }
    });
}


function insertDataProduct(name,count,price){
   var text = 
    '<tr>'+
        '<td>1.</td>'+
        '<td>'+name+'</td>'+
        '<td>'+count+'</td>'+
        '<td><span class="badge bg-red">S/.'+price+'</span></td>'+
    '</tr>';
    
    $('#table-order tbody').append(text);
    
}






function insertButtonCreateOnOrder(){
    $('.table-orders').before('<button id="create_order" data-toggle="modal" class="pull-left fcbtn btn btn-outline btn-info btn-1f" data-target="#create-order-modal" type="button" name="button" style="height: 31.31px;font-size:0.88em; padding: 0.5em 1em;"><i class="fa fa-plus"></i> Agregar pedido </button>');
}

function format(state) {
    if (!state.id) return state.text; // optgroup
    return "<img class='flag' src='./public/img/avatar.png'/>" + state.text + ' jeje';
}

function instanceSelect(test){
    $(test).select2({
        formatResult: format,
        formatSelection: format,
        escapeMarkup: function(m) { return m; }
    });
}

