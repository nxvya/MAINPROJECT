function sendFalsePositiveReport(goodURL){
    $.ajax({
        type: "POST",
        url: "http://192.168.43.55/hello", //hotspot
        contentType: "application/json",
        data: JSON.stringify({URLText: goodURL}),
        dataType: "json",
        success: function(response) {
            //alert(JSON.stringify(response));
        },
        error: function(err) {
            //alert("Fail to get a response");
        }
    });
  }
  
  function checkURLFunction(stringURL){
    $.ajax({
        type: "POST",
        url: "http://192.168.43.55:5000", //hotspot
        contentType: "application/json",
        data: JSON.stringify({URLText: stringURL}),
        dataType: "json",
        beforeSend: function(){
            $("#outputImage").hide();
            $('#output').hide();
            $("#loader").show();
        },    
        complete: function(){
            $("#loader").hide();
            $("#outputImage").show();
            $('#output').show();
        },
        success: function(response) {
            if(response == "Good"){
                sendFalsePositiveReport(stringURL);
                $("#outputDiv").show();
                var myOutput = document.getElementById('output');
                myOutput.innerText = 'The website is safe!';
                var myImage = document.getElementById('outputImage');
                myImage.setAttribute('src','../icon/tickSymbol.png');
                myOutput.style.color = 'green';
                myOutput.style.fontWeight = 'bold';
            } 
            else if(response == "No such website"){
                document.getElementById('dialog').innerHTML = 'Please enter a valid url! (EG https://www.google.com)';
                $('#dialog').dialog({
                    modal:true,
                    resizable:false,
                    height:100,
                    buttons: [{
                        text: "OK",
                        click: function(){
                            $(this).dialog('close');
                        }
                    }]
                });
                $("#outputDiv").hide();
            }
            else {
                $("#outputDiv").show();
                var myOutput = document.getElementById('output');
                myOutput.innerText = 'The website is malicious!';
                myOutput.style.color = 'red';
                myOutput.style.fontWeight = 'bold';
                var myImage = document.getElementById('outputImage');
                myImage.setAttribute('src','../icon/warning.png');
                myImage.style.width = '40px';
                myImage.style.height = '40px';
            }
        },
        error: function(err) {
            alert("Fail to get a response");
        }
    });     
  }
  
  function isEmpty(str){
    return !str.replace(/\s+/, '').length;
  }
  
  $(function(){  
    $('#checkURL').click(function(){
        var inputValue = $('#valueOfCheck').val();
        if(isEmpty(inputValue)){
            document.getElementById('dialog').innerHTML = 'Please enter a url!';
            $('#dialog').dialog({
                modal:true,
                resizable:false,
                height:100,
                buttons: [{
                    text: "OK",
                    click: function(){
                        $(this).dialog('close');
                    }
                }]
            });
        }
        else{
            checkURLFunction(inputValue);
        }
    });
  });
  