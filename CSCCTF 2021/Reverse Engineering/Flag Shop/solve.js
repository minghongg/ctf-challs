Java.perform(function(){
    Java.choose("com.chevaliers.flagshop.model.User", {
        onMatch: function (user_instance) {
            user_instance.setBalance(9000);
        },
        onComplete: function () { }

    });

    //green flag
    var flag_class = Java.use("com.chevaliers.flagshop.flag.Flag");
    var string_class = Java.use("java.lang.String");
    flag_class.getInstance.overload().implementation = function(){
        var string_instance = string_class.$new("test1234");
        var flag_instance = flag_class.$new(string_instance,true,10);
        return flag_instance;
    }

    //yellow flag
    var another_flag_class = Java.use("com.chevaliers.flagshop.flag.Flag$AnotherFlag");
    another_flag_class.getInstance.overload().implementation = function(){
        var string_instance = string_class.$new("test123");
        var another_flag_instance = another_flag_class.$new(string_instance);
        return another_flag_instance;
    }

    //black flag
    another_flag_class.myMethod.overload().implementation = function(){
        var integer_class = Java.use("java.lang.Integer");
        var array_list = Java.use('java.util.ArrayList');
        var array_list_instance = array_list.$new();
        var val_1 = integer_class.$new(1);
        var val_2 = integer_class.$new(2);
        var val_3 = integer_class.$new(1337);
        array_list_instance.add(val_1);
        array_list_instance.add(val_2);
        array_list_instance.add(val_3);
        return array_list_instance;
    }
});