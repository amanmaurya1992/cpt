var dictionary = new Typo( "en_US" );
function getValidations(validationData, sheetHeaders, notNulls, expression, brands) {
// console.log(validationData, sheetHeaders, notNulls, expression, brands)
var expressionkey=Object.keys(expression)
// console.log(expressionkey)
  var validators = {};
  var categories = Object.keys(validationData);
  // console.log(categories)
  var validNull = function(value, callback) {
   //console.log.log("check brand value",value);
    var val = notNullValidation(value);
     // var val1 = dictionary.check(value)
    setTimeout(function() {
      if (val ) callback(true);
      else callback(false);
    });
  };
  var notNullValidation = function(value) {
      if(!!value!=false && value!=/^([^\s])/) return true;
      else return false;
  }
  var inDropDown = function(list, value) {
    return list.indexOf(value) > -1;
  }
  var checkRestrict = function(value, callback){
    var val = checkBrands(value);
     setTimeout(function() {
      if (val) callback(true);
      else callback(false);
    },1000);
  }
  var checkSpell = function(value, callback){
    var val = dictionary.check(value)
    // console.log(val,value)
     setTimeout(function() {
      if (val&&value=='') callback(true);
      else callback(false);
    },1000);
  }
  var checkBrands = function(value){
  
    var Brands = brands['Brands'];
    var flag = true;
    if(Brands!=undefined){
    Brands.forEach(function(brand){
      var b1=brand.toLowerCase();
      var val = value.toLowerCase();
      if(b1 == val|| val==''){
        flag = false;
      }
    });
  }
    return flag;
  }

  var validexp = function(value, callback){
    setTimeout(function(){
      callback(true);
    },1000);
  }

  categories.forEach(function(category, index) {

    var notNull = notNulls[category];
  //console.log.log('notNull',notNull)
    var expr = Object.keys(expression);
    validators[category] = sheetHeaders.map(function(columnName, i) {
 
      // console.log(columnName,i)
      if(expr && expr.indexOf(columnName) > -1){
        return {data: i, allowInvalid: true, validator: validexp, renderer: expressionValueRenderer, strict: true};
      }
      if(columnName == 'Brand'){
      //console.log.log(i)
        // return{data: i, allowInvalid: true, validator: validNull, strict: true, allowEmpty: false}
        return {data: i, allowInvalid: true,allowEmpty: false, validator: checkRestrict, strict: true, renderer: spellValueRenderer};
      }
      
      /*if (columnName == 'Image Name' || columnName == 'image' || columnName == 'Image') {
        return {data: i, allowInvalid: true,  renderer: coverRenderer, strict: true};}*/
      // if (columnName == 'MRP' || columnName == 'Price') {
      //   return {data: i, allowInvalid: true, validator: validatePrice, renderer: defaultValueRenderer, strict: true};
      // } 
      // if(notNull && notNull.indexOf(columnName) ==-1){
      //    return {data: i, type: 'text',  allowInvalid: true, strict: true,allowEmpty: false};
      // }
      if(columnName=='Category Id'||columnName=='Category Id 1'){
        return {data: i, allowInvalid: false,allowEmpty: false,readOnly: true};
      }else  if (notNull && notNull.indexOf(columnName) == -1 && validationData && validationData[category] && validationData[category][columnName]) {
        alert(1+columnName)
        var list = validationData[category][columnName]; 
        return {data: i, type: 'autocomplete', validator: validValueInList, source: list, allowInvalid: true, strict: true,allowEmpty: false};
        var validValueInList = function(value, callback) {
          setTimeout(function() {
            if (inDropDown(list, value)) callback(true);
            else callback(false);
         });
        }
      } else if (notNull && notNull.indexOf(columnName) == -1 && validationData&& 0 && validationData[category] || validationData[category][columnName]) {
        // console.log(notNull,columnName,notNull.indexOf(columnName))
        // alert(1+columnName)
        var list = validationData[category][columnName]; 
        return {data: i, type: 'autocomplete', validator: validValueInList, source: list, allowInvalid: true, strict: true,allowEmpty: false};
        var validValueInList = function(value, callback) {
          setTimeout(function() {
            if (inDropDown(list, value)) callback(true);
            else callback(false);
         });
        }
      //console.log.log(columnName, i,list)
      // return {data: i,allowInvalid: true, validator: validNull, strict: true, allowEmpty: false};
      
      } else if(notNull && notNull.indexOf(columnName) > -1){
        
        return {data: i, allowInvalid: true, validator: validNull, strict: true, allowEmpty: false, renderer: spellValueRenderer};
      } else {

       
         return {data: i, allowInvalid: true, renderer: spellValueRenderer};
        // return {data: i, allowInvalid: false,allowEmpty: false};
      }
    }); 
  });
 
  return validators;




  function defaultValueRenderer(instance, td, row, col, prop, value, cellProperties) {
    var args = arguments;
    var mrpColumnIndex = sheetHeaders.indexOf('MRP');
    var priceColumnIndex = sheetHeaders.indexOf('Price');
    var rowData = instance.getData()[row];
    if (!mrpPriceCheck(instance, row)) {
      // alert(mrpColumnIndex,priceColumnIndex)
      if(col == mrpColumnIndex || col == priceColumnIndex)
        td.style.color = 'RED';
    }
    Handsontable.renderers.TextRenderer.apply(this, args);
  }
   function spellValueRenderer(instance, td, row, col, prop, value, cellProperties) {
    var args = arguments;
    // var mrpColumnIndex = sheetHeaders.indexOf('MRP');
    // var priceColumnIndex = sheetHeaders.indexOf('Price')
   var rowData1= instance.getDataAtCell(row,col)
    if(rowData1!=''){
      rowData1=rowData1.split(' ')
    }
    var flag=true;
    for (var i = 0; i < rowData1.length; i++) {
        var a=dictionary.check(rowData1[i])
        if(a==false){
          flag=false;
        }
    }
    // var rowData =dictionary.check(instance.getDataAtCell(row,col));
    // var a=true;
    // for (var i = 0; i < rowData.length; i++) {
    //      a=dictionary.check(rowData[i])
    //      if(!a){
    //       return
    //      }
    // }
    if (!flag) {
      // alert(mrpColumnIndex,priceColumnIndex)
        td.style.color = 'Blue';
      // if(col == mrpColumnIndex || col == priceColumnIndex)
      //   td.style.color = 'yellow';
    }
    Handsontable.renderers.TextRenderer.apply(this, args);
  }

  function validatePrice(value, callback) {
    setTimeout(function(){
      if (parseInt(value) > 0 && /^([^\s])/.test(value)) {
        callback(true);
      } else callback(false);
    }, 1000)
  }

  function mrpPriceCheck(instance, row) {
    //10 is mrp and 11 is price
    var mrpColumnIndex = sheetHeaders.indexOf('MRP');
    var priceColumnIndex = sheetHeaders.indexOf('Price');
    var rowData = instance.getData()[row];
    if (parseFloat(rowData[mrpColumnIndex]) < parseFloat(rowData[priceColumnIndex]))
      return false;
    return true;
  }

    function coverRenderer(instance, td, row, col, prop, value, cellProperties) {
    var escaped = Handsontable.helper.stringify(value);
   // alert("jai mata di");
    if (escaped.indexOf('http') === 0) {
      var $img = $('<img>');
      $img.attr('src', value);
      $img.on('mousedown', function (event) {
        event.preventDefault(); //prevent selection quirk
      });
      $(td).empty().append($img); //empty is needed because you are rendering to an existing cell
    }
    else {
      Handsontable.TextCell.renderer.apply(this, arguments); //render as text
    }
    return td;
  };

   function expressionValueRenderer(instance, td, row, col, prop, value, cellProperties) {
    var args = arguments;
    var rowData = instance.getData()[row];
    var vs = Object.keys(expression);
    // console.log(vs)
    vs.forEach(function(v) {
      // console.log(expression[v])
      var validation1 = expression[v];
      // console.log(validation1)
      validation1.forEach(function(valid){
        // console.log(valid)
        var validation=valid;
        var columns = validation.split(/[^A-Za-z]/)
        .filter(function(x) {return x.length > 0;});
        var changedValidation = valid;
        // console.log('columns',columns)
        var columnIndexes = [];
        columns.forEach(function(column) {
          var columnIndex = sheetHeaders.indexOf(column);
          // console.log('asdasdasd',column)
          columnIndexes.push(columnIndex);
          if(!!rowData[columnIndex]!=false && rowData[columnIndex]!=/^([^\s])/ && !(/^[a-zA-Z]+$/.test(rowData[columnIndex]) && columnIndex != -1)){
            changedValidation = changedValidation.replace(column, rowData[columnIndex]);
            // console.log('changedValidation',changedValidation)
          }
          else{
            changedValidation="";
          }
        });
        var setToColumn = sheetHeaders.indexOf(v);
        if(changedValidation != ''){
          //console.log(changedValidation)
          rowData.map(function(x, i) {
           
            if (i == setToColumn) {
              // console.log(x,setToColumn,changedValidation)
              // console.log('eval',eval(x+changedValidation))
              var final1=eval(x+changedValidation);
              if(!final1){
                if(col == sheetHeaders.indexOf(v))
                {
                  td.style.color = 'RED';
                }
              }
            } 
          });
        }
     });
      
      Handsontable.renderers.TextRenderer.apply(this, args);
  });  
    
  }
}

