/* FUNCIONES DE INPUTS */
var inputs = [];
var  cal = {};


/* storage object */

var yc_obj = {

   precio_bs_dolar:0,
   

}


/* fin de storage object */
function showStatus(online) {

   if (online) {

   } else {

   }
 }
 
 window.addEventListener('load', () => {
  
   navigator.onLine ? showStatus(true) : showStatus(false);
 
   window.addEventListener('online', () => {
     showStatus(true);
   });
 
   window.addEventListener('offline', () => {
     showStatus(false);
   });
 });


function setinput(funcion){

    $.fn.inputFilter = function (inputFilter,process) {
      return this.on("input  select contextmenu drop", function () {
        //keydown keyup mousedown mouseup
          if (inputFilter(this.value)) {
              process instanceof Function? process(this):null;
              this.oldValue = this.value;
              this.oldSelectionStart = this.selectionStart;
              this.oldSelectionEnd = this.selectionEnd;
          } else if (this.hasOwnProperty("oldValue")) {
          
              this.value = this.oldValue;
              this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
          } else {
          
              this.value = "";
          }
      });
  };

  funcion instanceof Function ? funcion():alert("error al declarar funcion en setinput");

}

function act_pag_dolar(_obj) {
  var iframedolar = $(_obj)?$(_obj):false;
  if(iframedolar){
      iframedolar.prop("src","/dolartwitter.html?timestamp=" + new Date().getTime());
  }
}

function setdata_float_text(_this){

  
  var m = parseFloat(_this.innerText);
   $(_this).data("val_float",(isNaN(m)|| m==Infinity)?0:m);
}

function setdata_float_input(_this){

  var m = parseFloat(_this.value);
  
  
   $(_this).data("val_float",(isNaN(m)|| m==Infinity)?0:m);
   console.log(_this.id+":M. ES :"+ $(_this).data("val_float"));
}

function toglee_pago_class(opcion){

      if(opcion){

        cal.label_resto.removeClass("debe");
        cal.label_resto.addClass("completo");

      }else{

        cal.label_resto.removeClass("completo");
        cal.label_resto.addClass("debe");

      }


}
function init() {

  
  $("#save_p_dolar").on("click",function(){

    yc_obj.precio_bs_dolar = cal.p_b_dolar.val();
    console.log("precio dolar" + yc_obj.precio_bs_dolar );
    localStorage.setItem("key",JSON.stringify(yc_obj));

  });


    
  $("#prueba").click(function(){
      localStorage.removeItem("key");  
  });
  
  
  setinput(function(){
      $(".yc-numbers").inputFilter(function(value) {
          return /^\d*$/.test(value);
      },function(_this){  
          setdata_float_input(_this);
      }

  )});





   cal = {
          p_b_dolar : $("#precio_bs_dolar"),
          t_b_venta : $("#total_bs_venta"),
          m_dolar   : $("#monto_dolar"),
          m_bs      : $("#monto_bs"),
          p_dolar   : $("#pago_dolar"),
          p_bs      : $("#pago_bs"),
          r_dolar   : $("#resto_dolar"),
          r_bs      : $("#resto_bs"),
          label_faltante: $("#sms_faltante"),
          label_resto: $("#sms_resto"),
          label_p_dolar:$("#sms_p_dolar"),
          label_t_venta:$("#sms_t_venta"),
          f_calcular:function(){

             var precio_bs_dolar =  this.p_b_dolar.data("val_float");
             var total_bs_venta  =  this.t_b_venta.data("val_float");
             console.log("precio_dolar:"+precio_bs_dolar+" :: total venta ::"+ total_bs_venta );
             var dolares = (total_bs_venta / precio_bs_dolar);
      
             dolares = (isNaN(dolares)||dolares==Infinity)?0:dolares;
             console.log("xz:dolares:"+dolares);
             var dolares_int = Math.trunc(dolares);

             if(total_bs_venta >= precio_bs_dolar  ){

           

                this.m_dolar.val(dolares_int);
                var bolivares  = (precio_bs_dolar *  (dolares - dolares_int)).toFixed(0);

                if(bolivares >0 ){
                 
                  this.label_faltante.html(" le hace falta :<b>"+(precio_bs_dolar-bolivares )+
                                         " Bs.</b><br/> para completar <b>:" +(Math.trunc(dolares) +1)+" Dolares ($)</b>");

                }else{
              
                  if(precio_bs_dolar>0){

                    //var bolivares  = total_bs_venta;
                  }else{

                    var bolivares  = total_bs_venta;
                  }
                 


                  this.label_faltante.html("<b> " +Math.trunc(dolares)+ " Dolares  $ </b> completos");
                }

             

             }else{
             
                this.m_dolar.val(0);
                var bolivares  = total_bs_venta;
                this.label_faltante.html(" le hace falta :<b>"+(precio_bs_dolar-total_bs_venta)+
                " Bs.</b><br/> para completar <b> 1  Dolar ($)</b>");

             }

             this.m_bs.val(bolivares);
             setdata_float_input(this.m_bs[0]);
             setdata_float_input(this.m_dolar[0]);
             
          },
          f_pago:function(){

                  
            var precio_bs_dolar =  this.p_b_dolar.data("val_float");
            var total_bs_venta  =  this.t_b_venta.data("val_float");
            var monto_dolar     =  this.m_dolar.data("val_float");
            var monto_bs        =  this.m_bs.data("val_float");

            var pago_dolar  = this.p_dolar.data("val_float");
            var pago_bs     = this.p_bs.data("val_float");

            var bolivares   = pago_bs - monto_bs;

           // console.log("f_pago: " +monto_dolar  + "::"+ monto_bs)

            if(pago_dolar == monto_dolar){
              console.log("prmero");

                 if(monto_bs>0){
                  console.log("primero 2");
                   this.r_dolar.val(0);


                   if(pago_bs>0){

                       if(bolivares==0){

                          this.label_resto.html("El cliente ha realizado el pago ");
                          toglee_pago_class(true);
                          

                       }else if(bolivares>0){

                          this.r_bs.val(bolivares);
                          this.label_resto.html("El cliente ha realizado el pago ");
                          toglee_pago_class(true);

                       }else{

                          this.r_bs.val(0);
                          this.label_resto.html("El cliente debe :<b>"+ (-1 * bolivares) +" Bs.</b>");
                          toglee_pago_class(false);

                       }    


                   }else {

                     // console.log("tambien aqui");
                      this.r_bs.val(0);
                      this.label_resto.html("El cliente debe :<b>"+monto_bs +"</b> Bs.");
                      toglee_pago_class(false);
                   }
                   

                 }else{
                 // console.log("primero 22");
                  this.r_bs.val(pago_bs);
                  this.r_dolar.val(0);

                  var stringsms = "El cliente ha realizado el pago ";
                 
                    if(pago_bs>0){

                         stringsms += "<br/> Tambien ha cancelado de más por un monto de :"+pago_bs+" Bs.";
                    }
                  this.label_resto.html(stringsms);

                  toglee_pago_class(true);
                    
 


                 }

            }else if(pago_dolar < monto_dolar){

              // console.log("condicion pago_dolar < monto_dolar :: "+pago_dolar +"<"+ monto_dolar );

               if(pago_dolar>0){

                var res_bs = ((monto_dolar -  pago_dolar ) * precio_bs_dolar) + (monto_bs - pago_bs); 

                if(res_bs<=0){

                  this.r_dolar.val(0);
                  this.r_bs.val((-1*res_bs));
                  this.label_resto.html("El cliente ha pagado ");
                  toglee_pago_class(true);

                }else{

                  this.r_dolar.val(0);
                  this.r_bs.val(0);
                  this.label_resto.html("El cliente debe :<b>"+res_bs +"</b> Bs.");
                  toglee_pago_class(false);

                }

               }else{

                  var res_bs =  pago_bs -  total_bs_venta;
                  this.r_dolar.val(0);

                  if(res_bs>=0){

                    this.r_bs.val(res_bs);
                    this.label_resto.html("El cliente ha pagado ");
                    toglee_pago_class(true);
              
                  }else{
                    this.r_bs.val(0);
                    this.label_resto.html("El cliente debe :<b>"+(-1*res_bs) +" Bs.</b>");
                    toglee_pago_class(false);
                  }

               }

            }else{
              console.log("primero 233");
              // es mayor pago dolar que monto dolar

                 if(monto_bs>0){
                   

                     if(precio_bs_dolar==0){


                        if(pago_bs>0){

                          var res_bs = pago_bs - monto_bs;
                          if(res_bs>=0){

                             
                            this.r_bs.val(res_bs);
                            this.label_resto.html("El cliente ha pagado ");
                          }else{


                            this.label_resto.html("El cliente debe : "+(res_bs*-1)+" Bs.");
                          }
                       
                        }else{

                          this.r_dolar.val(0);
                          this.r_bs.val(0);
                        }
           

                     }else{

                      var res_dolar = pago_dolar - monto_dolar - 1;
                      //console.log("monto_dolar:"+monto_dolar); 
                      var res_bs    = precio_bs_dolar - monto_bs + pago_bs;
 
                      this.r_dolar.val(res_dolar);
                      this.r_bs.val(res_bs);
           
                      this.label_resto.html("El cliente ha pagado ");
                      if(pago_bs > 0){

                         this.label_resto.html(this.label_resto.html()+ " <br> " + " El cliente esta cancelando "+ pago_bs + " Bs. demas " );
  
                       }
                     }


                

                     toglee_pago_class(true);
                 }else{

                      console.log("aqui es");
                     // igual acero

                 }


            }

            //console.log("f_pago: " +monto_dolar  + "::"+ monto_bs)


            this.label_p_dolar.html("Precio del Dolar :" + this.p_b_dolar.val()+" Bs.");
            this.label_t_venta.html("Monto Total de la Venta : "+this.t_b_venta.val()+" Bs.");
          },
          f_divisas:function(){

            

            
                var precio_bs_dolar =  this.p_b_dolar.data("val_float");
                var monto_dolar     =  this.m_dolar.data("val_float");
                console.log("f_divisas :"+precio_bs_dolar);
              if(precio_bs_dolar>0){
                var total = precio_bs_dolar * monto_dolar;
                console.log("monto_divisa: " + total);
                this.t_b_venta.val(total);
                this.t_b_venta.trigger("input");

              }

          }
          ,
          init:function(){

            this.p_b_dolar.trigger("input");
            this.t_b_venta.trigger("input");
            this.p_dolar.trigger("input");
            this.p_bs.trigger("input");

          }
        };
 
    var precio_d = JSON.parse(localStorage.getItem("key"));

    if(precio_d instanceof Object){ 
      cal.p_b_dolar.val(precio_d.precio_bs_dolar);
    }


   cal.init();

   cal.t_b_venta.on("input",function(){
         cal.f_calcular();
         cal.f_pago();
   });
   cal.p_b_dolar.on("input",function(){
         
         cal.f_calcular();
         cal.f_pago();
   });  
   cal.p_dolar.on("input",function(){
         cal.f_pago();
   });

   cal.p_bs.on("input",function(){
        cal.f_pago();
   }); 
   cal.m_dolar.on("input",function(){

    cal.f_divisas();

   });  

   
}



(function ($) {

    init();

}(jQuery));

