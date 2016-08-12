var matcher_editor = new Object();

matcher_editor.input_group_vm = null;
matcher_editor.tmp_conditions_vm = null;
matcher_editor.tmp_conditions = { };
matcher_editor.condition_input_meta = {
    'Header':[
        {
            'group_name':'Name of header want to test',
            'input':[
                {
                    'title':'operator',
                    'name':'name_operator',
                    'type':"select",
                    'options':{
                        'Match RegEx':"≈",
                        'Not Matche RegEx':"!≈",
                        'Equal':"=",
                        'Not Equal':"!=",
                    }
                },
                {
                    'title':'value',
                    'name':'name_value',
                    'type':'textarea',
                    'placeholder':'If operator is "is Null", this field will be ignored',
                }
            ]
        },
        {
            'group_name':'value of header',
            'input':[
                {
                    'title':'operator',
                    'name':'operator',
                    'type':"select",
                    'options':{
                        'Match RegEx':"≈",
                        'Not Matche RegEx':"!≈",
                        'Equal':"=",
                        'Not Equal':"!=",
                    }
                },
                {
                    'title':'value',
                    'name':'operator',
                    'name':'value',
                    'type':'textarea',
                    'placeholder':'If operator is "is Null", this field will be ignored',
                }
            ]
        }
    ],

};

matcher_editor.init = function(){
    
    matcher_editor.tmp_conditions_vm = new Vue({
        el: '#verynginx_matcher_editor',
        data: {
            conditions:matcher_editor.tmp_conditions
        },
    });

    matcher_editor.input_group_vm = new Vue({
        el: '#config_modal_matcher_input_group',
        data: { input_meta:[] },
    });
}


matcher_editor.get_data = function(){
    var data = util.clone( matcher_editor.tmp_conditions ); 
    var name = $('#config_matcher_editor_name').val()
    data['name'] = $.trim(name);
    return data;
}

matcher_editor.set_data = function( data ){
    $('#config_matcher_editor_name').val( data['name'] ) ;
    delete data['name'];
    matcher_editor.tmp_conditions = data;
    matcher_editor.tmp_conditions_vm.$data = {conditions:matcher_editor.tmp_conditions};
}

matcher_editor.reset = function(){
    $('#config_matcher_editor_name').val('');
    matcher_editor.tmp_conditions = {};
    matcher_editor.tmp_conditions_vm.$data = {conditions:matcher_editor.tmp_conditions};
}

matcher_editor.tmp_conditions_delete = function( btn ){
    
    //console.log('tmp_conditions_delete:',btn);
    var key = $(btn).parent().children('.config_matcher_block_type').text();
    //console.log('key:',key);

    Vue.delete( matcher_editor.tmp_conditions, key );
}

matcher_editor.modal_condition_open = function(){
    $('#config_modal_condition').modal('show');
    matcher_editor.modal_condition_switch_input();
}

matcher_editor.modal_condition_switch_input = function(){
    var condition_type = $("#config_modal_condition [name=condition_type]").val();
    
    //console.log('condition_type',condition_type);

    matcher_editor.input_group_vm.$data = { 'input_meta': matcher_editor.condition_input_meta[condition_type] } ;
    $(".condition_value").val('');
    
    //make the modal in the center
    Vue.nextTick( function(){
         dashboard.modal_reposition.call( $("#config_modal_condition")[0] );
    });
}

matcher_editor.modal_condition_save = function(){
    var condition_type = $("#config_modal_condition [name=condition_type]").val();
    
    if( matcher_editor.tmp_conditions[condition_type] != null ){
        dashboard.notify('Condition [' + condition_type + '] already existed');
        return;
    }
    
    var inputer_list = $('#config_modal_matcher_input_group .config_matcher_editor_value');
    
    var condition_value = {};
    for( var i=0; i < inputer_list.length; i++ ){
        var inputer = inputer_list[i];
        var name = $(inputer).attr('name');
        var value = $(inputer).val();
        condition_value[name] = value;
    }

    //when operator = "is null", value will be ignored
    if( condition_value['operator'] == '!' ){
        delete condition_value['value'];
    }

    //console.log("Add matcher condition:", condition_type, condition_value);
    Vue.set(matcher_editor.tmp_conditions, condition_type, condition_value);
    $('#config_modal_condition').modal('hide');
}



