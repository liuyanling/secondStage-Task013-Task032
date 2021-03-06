﻿//存放需要用的id节点
var data_box = {
    style_box: {
        box: $('#select_box'),       //展示的方式
        value: 'value'
    },
    type_box: {
        box: $('#type_box'),         //标签名（input radio textarea checkbox select）
        value: 'className'           //获取方式
    },
    label_box: {
        box: $('#lable_box'),        //label名称 （如性别 姓名）
        value: 'value'
    },
    necessary_box: {
        box: $('#basic_box'),        //是否必填（true false）
        value: 'className'
    },
    input_type_box: {
        box: $('#rule_input'),       //input类型的规则（邮箱，号码，数字，文本，密码）
        value: 'className'
    },
    item_box: [                      //showTag的参数
        $('#box_item_input'),       //inputNode
        $('#box_item_show'),        //展示选项的容器
        document.getElementsByClassName('item')],   //选项的Node节点，可以获取选项
    min_length_box: {
        box: $('#min_length'),       //有长度限制的最小长度
        value: 'value'
    },
    max_length_box: {
        box: $('#max_length'),       //有长度限制的最大长度
        value: 'value'
    },
    add_btn: $('#btn_add'),         //添加展示表单的按钮
    result_box: $('#result'),       //表单的展示区域
    submit_form: $('#submit_form')  //提交展示表单的按钮
};
//存放各个类型的validator函数
var validator= {
    //text password textarea
    'length_control': function () {
        min_length = this.data.min_length;
        max_length = this.data.max_length;
        var text = this.ipt.value;
        if (text == '') {
            if (this.data.necessary)
                this.error_tip(0);
            else {
                this.default_tip();
                return true;
            }
        }
        else {
            var total = (/[\x00-\xff]/.test(text) ? text.match(/[\x00-\xff]/g).length : 0) + (/[^\x00-\xff]/.test(text) ? text.match(/[^\x00-\xff]/g).length * 2 : 0);
            if (total < min_length) {
                this.error_tip(1);
            }
            else if (total > max_length) {
                this.error_tip(2);
            }
            else {
                this.true_tip();
                return true;
            }
        }
        return false;
    },
    'number': function () {
        var text = this.ipt.value;
        if (text == '') {
            if (this.data.necessary)
                this.error_tip(0);
            else {
                this.default_tip();
                return true;
            }
        }
        else {
            if (/^\d*$/.test(text)) {
                this.true_tip();
                return true;
            }
            else {
                this.error_tip(1);
            }
        }
        return false;
    },
    'email': function () {
        var text = this.ipt.value;
        if (text == '') {
            if (this.data.necessary)
                this.error_tip(0);
            else {
                this.default_tip();
                return true;
            }
        }
        else {
            if (/^[0-9a-z]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]+.){1,63}[a-z0-9]+$/.test(text)) {
                this.true_tip();
                return true;
            }
            else {
                this.error_tip(1);
            }
        }
        return false;
    },
    'phone': function () {
        var text = this.ipt.value;
        if (text == '') {
            if (this.data.necessary)
                this.error_tip(0);
            else {
                this.default_tip();
                return true;
            }
        }
        else {
            if (/\d{11}/.test(text)) {
                this.true_tip();
                return true;
            }
            else {
                this.error_tip(1);
            }
        }
        return false;
    },
    'radio': function () {
        var item = $('#' + this.data.id).getElementsByTagName('input');
        for (var i = 0; i < item.length; i++) {
            if (item[i].checked) {
                this.true_tip();
                return true;
            }
        }
        if (this.data.necessary)
            this.error_tip(0);
        else {
            this.default_tip();
            return true;
        }
        return false;
    },
    'checkbox': function () {
        var children = this.ipt.children;
        for (var i in children) {
            if (children[i].checked) {
                this.true_tip();
                return true;
            }
        }
        if (this.data.necessary)
            this.error_tip(0);
        else {
            this.default_tip();
            return true;
        }
        return false;
    },
    'select': function () {
        this.true_tip();
        return true;
    }
};
//数据产生
function Data_product(data_box) {
    this.box = data_box;
    this.id = 0;
}
Data_product.prototype= {
    addEvent: function () {
        on($('#data_create'), 'change', this.showTable.bind(this));
        on(this.box.style_box.box, 'change', this.setStyle.bind(this));
    },
    //通过data_box的box对象值，来获取相应的值
    getText: function (data_box) {
        return data_box.box[data_box.value];
    },
    showTable: function (e) {
        if (e.target.getAttribute('type') == 'radio') {
            e.target.parentNode.className = e.target.id;
            if (!/necessary/.test(e.target.id))
                this.box.label_box.box.value = e.target.nextElementSibling.textContent;
        }
    },
    //设置表单的信息获取的逻辑
    getData: function () {
        var data = {
            lable: '',              //标签名字
            type: '',               //表单类型
            necessary: true,        //是否必需
            input_type: '',         //input表单的种类
            min_length: 0,          //text之类文本的最小长度限制
            max_length: 1,          //text之类文本的最大长度限制
            default_text: '',       //获取焦点的默认提示
            success_text: '',       //输入正确的提示
            item: [],               //radio的选项
            fail_text: [],          //验证错误的提示
            id: 0,                  //表单的id，初始值为0
            validator: function () {
            } //表单的验证规则
        };
        data = this.getBaseData(data);
        switch (data.type) {
            case 'textarea' :
                data = this.getLengthRelativeData(data);
                break;
            case 'input' :
                switch (data.input_type) {
                    case 'text':
                    case 'password':
                        data = this.getLengthRelativeData(data);
                        break;
                    case 'number':
                    case 'email':
                    case 'phone':
                        data = this.getInputRelativeData(data);
                        break;
                }
                break;
            case 'radio':
            case 'select':
            case 'checkbox':
                data = this.getSpecialInputRelativeData(data);
                break;
        }
        return data;
    },
    setStyle: function () {
        var text = this.getText(this.box.style_box);
        console.log(text);
        this.box.result_box.className = text == '样式一' ? 'style1' : 'style2';
    },
    //总的添加表单的逻辑处理
    addForm: function (data) {
        switch (data.type) {
            case 'input':
                this.addInputForm(data);
                break;
            case 'textarea':
                this.addTextAreaForm(data);
                break;
            case 'radio':
                this.addRadioForm(data);
                break;
            case 'checkbox':
                this.addCheckboxForm(data);
                break;
            case 'select':
                this.addSelectForm(data);
        }

    },
    //配置表单的必需数据
    getBaseData: function (data) {
        data.lable = this.getText(this.box.label_box);
        data.type = this.getText(this.box.type_box);
        data.necessary = this.getText(this.box.necessary_box) == 'necessary';
        data.input_type = this.getText(this.box.input_type_box);
        data.id = 'form' + this.id++;
        return data;
    },
    //配置radio select checkbox的信息
    getSpecialInputRelativeData: function (data) {
        var items = this.box.item_box[2];
        data.item = [];//清空之前的item;
        for (var i = 0; i < items.length; i++) {
            data.item.push(items[i].childNodes[0].data);
        }
        if (data.item.length == 0) {
            alert('你还没有添加' + data.lable + '的选项');
            data = null;
        }
        else if (data.item.length == 1) {
            alert('你只添加了一个选项，无法创建' + data.lable);
            data = null;
        }
        else {
            data.default_text = (data.necessary ? '必填' : '选填') + '，请选择您的' + data.lable;
            data.fail_text = [data.lable + '未选择'];
            data.success_text = data.lable + '已选择';
            data.validator = validator[data.type];
        }
        return data;
    },
    //配置text password和textarea的信息
    getLengthRelativeData: function (data) {
        data.min_length = this.getText(this.box.min_length_box);
        data.max_length = this.getText(this.box.max_length_box);
        data.fail_text = [
            //'姓名不能为空','姓名长度不能小于4个字符','姓名长度不能大于16个字符'
            data.lable + '不能为空',
            data.lable + '长度不能小于' + data.min_length + '个字符',
            data.lable + '长度不能大于' + data.max_length + '个字符'
        ];
        //名称格式正确
        data.success_text = data.lable + '格式正确';
        //必填，长度为4-16个字符
        data.default_text = (data.necessary ? '必填' : '选填') + ',长度为' + data.min_length + '-' + data.max_length + '个字符';
        data.validator = validator.length_control;
        return data;
    },
    //配置Input中number，email，phone的信息
    getInputRelativeData: function (data) {
        data.input_type = this.getText(this.box.input_type_box);
        data.fail_text = [
            //'姓名不能为空','姓名长度不能小于4个字符','姓名长度不能大于16个字符'
            data.lable + '不能为空',
            data.lable + '格式不正确'
        ];
        //名称格式正确
        data.success_text = data.lable + '格式正确';
        //必填，长度为4-16个字符
        data.default_text = (data.necessary ? '必填' : '选填') + '，请输入您的' + data.lable;
        data.validator = validator[data.input_type];
        return data;
    },

    addInputForm: function (data) {
        var box = document.createElement('div');
        box.innerHTML = '<label>' + data.lable + '</label><input type="' + data.input_type + '" id="' + data.id + '"><span></span>';
        this.box.result_box.insertBefore(box, this.box.submit_form);
    },
    //添加textarea表单
    addTextAreaForm: function (data) {
        var box = document.createElement('div');
        box.innerHTML = '<label>' + data.lable + '</label><textarea id="' + data.id + '"></textarea><span></span>';
        this.box.result_box.insertBefore(box, this.box.submit_form);
    },
    //添加radio单选框
    addRadioForm: function (data) {
        var box = document.createElement('div'),
            text = '';
        box.className = 'radio_box';
        text += '<div id="' + data.id + '"><label class="formNameLabel" >' + data.lable + '</label>';
        for (var i = 0; i < data.item.length; i++) {
            var id = data.id + '' + i;
            text += '<input type="radio" id="' + id + '" name="' + data.id + '"><label for="' + id + '">' + data.item[i] + '</label>';
        }
        text += '</div><span></span>';
        box.innerHTML = text;
        this.box.result_box.insertBefore(box, this.box.submit_form);
    },
    //添加checkbox多选框
    addCheckboxForm: function (data) {
        var box = document.createElement('div'),
            text = '';
        box.className = 'radio_box';
        text += '<div id="' + data.id + '"><label class="formNameLabel" >' + data.lable + '</label>';
        for (var i = 0; i < data.item.length; i++) {
            var id = data.id + '' + i;
            text += '<input type="checkbox" id="' + id + '" name="' + data.id + '"><label for="' + id + '">' + data.item[i] + '</label>';
        }
        text += '</div><span></span>';
        box.innerHTML = text;
        this.box.result_box.insertBefore(box, this.box.submit_form);
    },
    //添加select下拉框
    addSelectForm: function (data) {
        var box = document.createElement('div'),
            text = '';
        text += '<label>' + data.lable + '</label><select id="' + data.id + '">';
        for (var i = 0; i < data.item.length; i++) {
            text += '<option>' + data.item[i] + '</option>'
        }
        text += '</select><span></span>';
        box.innerHTML = text;
        this.box.result_box.insertBefore(box, this.box.submit_form);
    }
};

//定义ShowTag构造器
function ShowTag(ipt,box) {
    this.arr = [];      //存放数组
    this.box = box;     //显示tag的容器
    this.ipt = ipt;     //输入框
    this.length = 100;   //显示的tag的数目
}
//ShowTag构造器方法
ShowTag.prototype= {
	init:function() {
		on(this.box, 'click', this.deleteEvent.bind(this));//删除元素事件的绑定
		on(this.ipt, 'keyup', this.keyUp.bind(this));    //输入框输入内容事件的绑定
	},
	keyUp:function(e) {
		if ( e.keyCode == '13') {
			this.add();
			this.ipt.value = '';
		}
	},
    // 去重
    trim: function () {
        var i = 0, j = 0;
        for (; i < this.arr.length; i++) {      //判断重复，如果元素重复就去掉该元素
            for (j = i + 1; j < this.arr.length; j++) {
                if (this.arr[i] == this.arr[j]) {
                    this.arr.splice(j, 1);
                    j--;
                }
            }
        }
        while (this.arr.length > this.length) {
            this.arr.shift();
        }
        this.show();//去重后重新显示标签
        return this;
    },
    //显示标签
    show: function () {
        var text = '';
        for (var index = 0; index < this.arr.length; index++) {
            text += '<div data-num="' + index + '" class="item">' + this.arr[index] + '</div>';
        }
        this.box.innerHTML = text;
        return this;
    },
    //将输入的值添加到数组中
    add: function () {
        str = this.ipt.value.split(/[ ,、， \n\t]/);   //回车，逗号（全角半角均可），顿号，空格（全角半角、Tab等均可）等符号作为间隔
        for (var i = 0; i < str.length; i++) {
            var item = str[i];
            if (item == '') {     //去掉空元素
            }
            else {
                this.arr.push(item);
            }
        }
        this.trim();   //调用去重函数
        return this;
    },
    //点击元素删除
    deleteEvent: function (e) {
        //事件代理，判断点击的元素
        var index=[].indexOf.call(e.target.parentNode.childNodes,e.target);
        //删除第n个元素，之后重新显示元素
        this.arr.splice(index, 1);
        this.show();
    },
    getData: function () {
        return this.arr;
    }
};


var data_product = new Data_product(data_box),
    showtag = new ShowTag(data_box.item_box[0],data_box.item_box[1],100),
    formArr = [];

data_product.addEvent();
showtag.init();

//绑定点击事件，点击添加按钮之后，返回表单的数据
on(data_product.box.add_btn,'click',function() {
    var data = data_product.getData();
    if (data != null) {
        //在form中添加相应的表单
        data_product.addForm(data);
        //存放表单并且将表单绑定到Form中，绑定验证函数
        formArr.push(new Form(data));
        //在表单为radio和checkbox时直接展示默认的提示
        if (data.type == 'radio' || data.type == 'checkbox') {
            formArr[formArr.length - 1].default_tip();
        }
    }
});

on(data_box.submit_form,'click',function() {
    var text = '';
    for (var i = 0; i < formArr.length; i++) {
        text += !formArr[i].validator() ? formArr[i].tip.textContent + '\n' : '';
    }
    text == '' ? alert('提交成功') : alert(text);
});

function $(selector) {
    return document.querySelector(selector);
}
function on(element,eventName,listener) {
    if (element.addEventListener) {
        element.addEventListener(eventName, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent('on' + eventName, listener);
    }
    else {
        element['on' + eventName] = listener;
    }
}

//表单验证工厂
function Form(data) {
    this.data = data;
    this.ipt = document.getElementById(data.id);
    this.tip = this.ipt.nextElementSibling;
    this.validator = data.validator;
    this.init();
}
Form.prototype= {
    init: function () {
        on(this.ipt, 'focus', this.default_tip.bind(this));
        on(this.ipt, 'blur', this.validator.bind(this));
    },
    default_tip: function () {
        this.tip.innerHTML = this.data.default_text;
        this.tip.className = 'default';
        this.ipt.className = 'default';
    },
    true_tip: function () {
        this.tip.innerHTML = this.data.success_text;
        this.tip.className = 'true';
        this.ipt.className = 'true';
    },
    error_tip: function (i) {
        this.tip.innerHTML = this.data.fail_text[i];
        this.tip.className = 'error';
        this.ipt.className = 'error';
    }
};



