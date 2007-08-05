/**
* Example custom inputs. There are four methods for a plugin. Two first are 
* mandatory. Methods explained in order of their appearance:
*
* 1. Create input element. Receives jEditable settings as parameter. Inside 
*    function variable *this* refers to original (clicked) element.
*
* 2. Set input element content. Receives two parameters. Input content (value)
*    as string. Second parameter is jEditabl settings. Inside function variable
*    *this* refers to input element.
*
* 3. Call before submit. This method should prepare value returned by 3rd party
*    plugin ready for submitting. Receives jEditable settings as parameter.
*    Inside function variable *this* refers to input element.
*
* 4. Attach 3rd party plugin to input field. Receives jEditable settings as 
*    parameter. Inside function variable *this* refers to input element.
*
*/

/* $Id $ */

/* Needs http://digitalbush.com/projects/masked-input-plugin */
$.editable.addInputType('masked', {
    /* Create input element. */
    element : function(settings) {
        /* Create an input. Mask it using masked input plugin. Settings */
        /* for mask were passed with jEditable settings hash. Remember  */
        /* to return the created input!                                 */
        var input = $('<input>').mask(settings.mask);
        $(this).append(input);
        return(input);
    }
});

/* Needs http://jquery.com/plugins/project/timepicker */
$.editable.addInputType('timepicker', {
    /* This uses default hidden input field. No need for element() function. */    

    /* Call before submit hook. */
    submit: function (settings) {
        /* Collect hour, minute and am/pm from pulldowns. Create a string from */
        /* them. Set value of hidden input field to this string.               */
        var value = $("#h_").val() + ":" + $("#m_").val() + "" + $("#p_").val();
        $("input", this).val(value);
    },
    /* Attach Timepicker plugin to the default hidden input element. */
    plugin:  function(settings) {
        $("input", this).filter(":hidden").timepicker();
    }
});

$.editable.addInputType('time', {
    /* Create input element. */
    element : function(settings) {
        /* Create and pulldowns for hours and minutes. Append them to */
        /* form which is accessible as variable this.                 */ 		
		var hourselect = $('<select id="hour_">');
		var minselect  = $('<select id="min_">');
		
		for (var hour=1; hour <= 24; hour++) {
		    if (hour < 10) {
		        hour = '0' + hour;
		    }
		    var option = $('<option>').val(hour).append(hour);
		    hourselect.append(option);
		}
		$(this).append(hourselect);

		for (var min=0; min <= 45; min = parseInt(min)+15) {
		    if (min < 10) {
		        min = '0' + min;
		    }
		    var option = $('<option>').val(min).append(min);
		    minselect.append(option);
		}
		$(this).append(minselect);
        
        /* Last create an hidden input. This is returned to plugin. It will */
        /* later hold the actual value which will be submitted to server.   */
        var hidden = $('<input type="hidden">');
        $(this).append(hidden);
        return(hidden);
    },
    /* Set content / value of previously created input element. */
    content : function(string, settings) {
        
        /* Select correct hour and minute in pulldowns. */
        var hour = parseInt(string.substr(0,2));
        var min = parseInt(string.substr(3,2));

		$("#hour_", this).children().each(function() {
		    if (hour == $(this).val()) {
		        $(this).attr('selected', 'selected');
		    }
		});
		$("#min_", this).children().each(function() {
		    if (min == $(this).val()) {
		        $(this).attr('selected', 'selected')
		    }
		});

    },
    /* Call before submit hook. */
    submit: function (settings) {
        /* Take values from hour and minute pulldowns. Create string such as    */
        /* 13:45 from them. Set value of the hidden input field to this string. */
        var value = $("#hour_").val() + ":" + $("#min_").val();
        $("input", this).val(value);
    }
});

/* Needs http://kelvinluck.com/assets/jquery/datePicker/v2/demo/ */
$.editable.addInputType('datepicker', {
    /* create input element */
    element : function(settings) {
        var input = $('<input>');
        $(this).append(input);
        //$(input).css('opacity', 0.01);
        return(input);
    },
    /* attach 3rd party plugin to input element */
    plugin : function(settings) {
        /* Workaround for missing parentNode in IE */
        var form = this;
        settings.onblur = 'cancel'
        $("input", this)
        .datePicker({createButton:false})
        .bind('click', function() {
            //$(this).blur();
            $(this).dpDisplay();
            return false;
        })
        .bind('dateSelected', function(e, selectedDate, $td) {
            $(form).submit();
        })
        .bind('dpClosed', function(e, selected) {
            /* TODO: unneseccary calls reset() */
            //$(this).blur();
    	})
        .trigger('change')
        .click();
    }
});

$.editable.addInputType('ajaxupload', {
    /* create input element */
    element : function(settings) {
        settings.onblur = 'ignore';
        var input = $('<input type="file" id="upload" name="upload">');
        $(this).append(input);
        return(input);
    },
    content : function(string, settings) {
        
    },
    plugin : function(settings, original) {
        var form = this;
        $("input:submit", this)
        .bind('click', function() {
            //$(".message").show();
            $.ajaxFileUpload({
                url: settings.target,
                secureuri:false,
                fileElementId: 'upload',
                dataType: 'html',
                success: function (data, status) {
        			$(original).html(data);
        			original.editing = false;
                },
                error: function (data, status, e) {
                    alert(e);
                }
            })
            return(false);
        });
    }
});

