<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="host">
                        <el-input v-model="form.host"></el-input>
                    </el-form-item>
                    <el-form-item label="选择器">
                        <el-select v-model="form.region" placeholder="请选择"  filterable @change="aa" @visible-change="getApiOptions">
                            <el-option v-for="item in api_options" :label ="item.api_name" :value="item.api_url">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="url">
                        <el-input v-model="form.url"></el-input>
                    </el-form-item>
                    <el-form-item label="单选框">
                        <el-radio-group v-model="form.resource" @change="bb">
                            <el-radio label="form-data"></el-radio>
                            <el-radio label="x-www-form-urlencoded"></el-radio>
                            <el-radio label="raw"></el-radio>
                        </el-radio-group>&nbsp&nbsp&nbsp&nbsp&nbsp
                        <el-select v-model="form.enctype" style="width:130px" :disabled= "form.select_flag">
                            <el-option v-for="item in enctype_options" :label="item.key" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="request_txt" v-show = "!form.select_flag">
                        <el-input type="textarea" rows="5" v-model="form.request_json" placeholder="json格式"></el-input>
                    </el-form-item>

                    <el-form-item v-for =" item in form.FormArr" v-show = "form.select_flag" >
                        <el-input  v-model="item.key" style="width:150px" placeholder="key"></el-input> &nbsp&nbsp&nbsp
                        <el-input  v-model="item.value" style="width:150px" placeholder="value"></el-input>&nbsp&nbsp&nbsp
                        <el-button type="primary" round @click="fff">新增</el-button>
                        <el-button type="danger" round @click="ddd(item.index)">删除</el-button>
                    </el-form-item>
                    <el-form-item label="response">
                        <el-input type="textarea" rows="5" v-model="response_txt"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="eee">确定</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>

                    <!-- <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.date1"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker
                                placeholder="选择时间"
                                v-model="form.date2"
                                style="width: 100%;"
                            ></el-time-picker>
                        </el-col>
                    </el-form-item> -->
                    <el-form-item label="断言开关">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item v-for =" item in form.assert" v-show = "form.delivery">
                        <el-row >
                            <el-input  v-model="item.key" style="width:150px" placeholder="key"></el-input> &nbsp
                            <el-select v-model="item.comparison_operator" style="width:55px">
                                <el-option v-for="c_o in comparison_operator" :label="c_o.key" :value="c_o.value"></el-option>
                            </el-select>
                            &nbsp
                            <el-input  v-model="item.assert_value" style="width:100px" placeholder="value"></el-input>&nbsp
                            <el-input  v-model="item.actually_vaule" style="width:80px" placeholder="value"></el-input>&nbsp
                            <el-select v-model="item.logical_operator" style="width:80px">
                                <el-option v-for="l_o in logical_operator" :label="l_o.key" :value="l_o.value"></el-option>
                            </el-select>
                        </el-row>
                        <el-row style="margin-top:10px">
                            <el-button type="primary" round @click="tiaoshi1(item.index)">调试</el-button>
                            <el-button type="primary" round @click="lll">新增</el-button>
                            <el-button type="danger" round @click="ddd(item.index)">删除</el-button>
                        </el-row>
                    </el-form-item>
                    <el-form-item v-show = "form.delivery" label='断言结果'>
                        <el-input  style="width:100px" v-model="assert_case" ></el-input>&nbsp
                        <el-button type="primary" round @click="assertCase">断言</el-button>
                    </el-form-item>
                    <el-form-item label="输出开关">
                        <el-switch v-model="form.data_out_switch"></el-switch>
                    </el-form-item>
                    <el-form-item v-show = "form.data_out_switch" label='断言结果'>
                        <el-input  style="width:300px" v-model="form.data_out" ></el-input>&nbsp
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { get_api_listAll } from '../../api/api';
import { create_test_api } from '../../api/test_api';

import axios from 'axios';
const db = window.localStorage 

export default {
    name: 'baseform',
    data() {
        return {
            api_options:[],
            enctype_options:[{"key":"application/json","value":"application/json"},{"key":"ccc","value":"mmm"}],
            response_txt:"",
            comparison_operator:[{"key":">","value":">"},{"key":"<","value":"<"},{"key":"=","value":"="}],
            logical_operator:[{"key":"and","value":"&&"},{"key":"or","value":"||"}],
            assert_case:"",
            form: {
                data_out:"",
                data_out_switch: false,
                select_flag: true,
                enctype:'',
                host: '',
                region: '',
                url:'',
                project_id: '',
                date2: '',
                delivery: true,
                type: ['步步高'],
                resource: '小天才',
                request_json: '',
                options: [],
                FormArr:[
                {
                    index:0,
                    key:"",
                    value:""
                },
                {
                    index:1,
                    key:"",
                    value:""
                }
            ],
            assert:[
                {
                    index:0,
                    key:"",
                    comparison_operator:"",
                    assert_value:'',
                    actually_vaule:'',
                    logical_operator:''
                }
            ]
            },
  
        };
    },
    methods: {

        aa(){
            this.form.url = this.form.region
            console.log("ccc")
        },
        bb(){
            this.form.select_flag = true

            if(this.form.resource === 'raw'){
                this.form.select_flag = false
            }
        },
        fff(){
            let len = this.form.FormArr.length
            console.log(len)
            this.form.FormArr.push({"index":len,"key":"","value":""})
        },
        lll(){
            let len = this.form.assert.length
            console.log(len)
            this.form.assert.push({"index":len,"key":"","comparison_operator":"","assert_value":"","actually_vaule":"","logical_operator":""})
        },
        ddd(index){
            console.log("aaaaa",index)
            this.form.FormArr.splice(index,1)
        },
        tiaoshi1(index){
            console.log("ffff",this.form.assert[index].key)
            let assert_value = this.form.assert[index].assert_value
            let comparison_operator = this.form.assert[index].comparison_operator
            // this.response_txt = '{"美国": {},"aa":[],"英国": ["爱尔兰","英格兰"],"中国": {"北京": [{"a":"朝阳"},{"a":"海淀"}],"广州": "天河"}}'   
            let keyarr = this.form.assert[index].key.split(".")
            let response_txt = JSON.parse(this.response_txt)
            let key = ""
            let key_index = ""
            for (let item in keyarr){
                if(keyarr[item].indexOf("[") > -1){
                    let key_indexarr = keyarr[item].split("[")
                    key = key_indexarr[0]
                    let basic = key_indexarr[1]
                    console.log("basic",basic)
                    //删除最后一个字符
                    key_index = basic.substring(0, basic.length - 1);
                    console.log("key_index",key_index)
                    console.log("key",key)
                    response_txt = response_txt[key][key_index]
                    console.log(response_txt)
                }else{
                    console.log("bbb",keyarr[item])
                    response_txt = response_txt[keyarr[item]]
                    console.log(response_txt)
                } 
            }
            response_txt = String(response_txt)            
            //后边处理为null
            console.log("response_txt.length",response_txt.length)
            if( response_txt.length === 0 || response_txt.length === undefined){
                response_txt = "null"
            }
            console.log("cccc",response_txt)
            if(comparison_operator === "="){
                if(response_txt === assert_value){
                    console.log(response_txt,assert_value)
                    this.form.assert[index].actually_vaule = "true"
                }else{
                    console.log(response_txt,assert_value)
                    this.form.assert[index].actually_vaule = "false"
                }
            }
            
            
        },
        tiaoshi(index){
            console.log("ffff",this.assert[index].key)

            let keyarr = this.assert[index].key.split("[")
            let key = ""
            let key_index = ""
            if(keyarr.length == 1){
                key = keyarr[0]
            }else{
                key = keyarr[0]
                let basic = keyarr[1]
                key_index = basic.substring(0, basic.length - 1);  
            }
            // console.log(key.split("["))
            // console.log("basic",basic)
            console.log(key)
            let comparison_operator = this.assert[index].comparison_operator
            let assert_value = this.assert[index].assert_value
            // this.response_txt = '{"code":"200","count":11,"data":[]}'    
            this.response_txt = '{"美国": {},"英国": ["爱尔兰","英格兰"],"中国": {"北京": ["朝阳","海淀"],"广州": "天河"}}'   
            let response_json = JSON.parse(this.response_txt)
            let actually_vaule = ""    
            let get_value = this.get_jsonValue(key,response_json)
            console.log("get_value",get_value)
            console.log("typeofvalue",typeof(get_value))
            console.log("lengthee",get_value.length)
            if( get_value.length === 0){
                get_value = "null"
            }
            if(comparison_operator === "="){
                if(keyarr.length == 1){
                    if(get_value === assert_value){
                        console.log(get_value,assert_value)
                        actually_vaule = "true"
                    }
                    else{
                        console.log(get_value,assert_value)
                        actually_vaule = "false"
                    }
                }else{
                    if(get_value[key_index] === assert_value){
                        console.log(get_value[key_index],assert_value)
                        actually_vaule = "true"
                    }
                    else{
                        console.log(get_value[key_index],assert_value)
                        actually_vaule = "false"
                    }                 
                }
          
            }

            this.assert[index].actually_vaule = actually_vaule

            console.log(this.assert[index].actually_vaule)
        },
        assertCase(){
            var assert_words = ""
            var assert = this.form.assert
            for (var item in assert){
                console.log(assert[item].logical_operator)
                if( assert[item].logical_operator === ""){
                    assert[item].logical_operator = "||"
                }
                assert_words = assert_words + " "+assert[item].actually_vaule +" "+assert[item].logical_operator
            }
            assert_words = assert_words.substring(0,assert_words.length - 2)
            console.log(assert_words)
            console.log(eval(assert_words))
            this.assert_case = eval(assert_words).toString()
        },
        eee(){
            let a={
                method:'post',
                url:'http://'+this.form.host+this.form.url,
                headers:{
                    'Content-Type': this.form.enctype + ';charset=utf-8'  
                },
                data:this.form.request_json
            }
            // axios.post('http://127.0.0.1:9995/get_api_list',{
            //     "page":1,
            //     "limit":20
            // }).then(function (response){
            //     console.log(",,,,,,,,,,,")
            //     console.log(response)
            // })
            axios(a).then(res =>{
                this.response_txt = JSON.stringify(res.data)
            })
            .catch((error)=>{
                this.$message.error("请求错误,请假查URL");
                // console.log(error)
            })
            },
        get_jsonValue(key,json_object){
            for(var item in json_object){
                console.log(json_object)
                console.log("bbbb",item)
                console.log("key",key)

                if(item === key){
                    console.log("sssss",item)
                    return json_object[item]
                }
                console.log("length",json_object[item].length)
                console.log("object",Object.keys(json_object[item]).length)
                if(Object.keys(json_object[item]).length != 0 && typeof(json_object[item]) === 'object'&& json_object[item].length === undefined ){
                    console.log("1111")
                    return this.get_jsonValue(key,json_object[item])
                }
            }

        },
        
        getApiOptions(){
            get_api_listAll().then (res =>{
                this.api_options = []
                for(let item of res.data){
                    this.api_options.push({
                        'api_name': item.api_name,
                        'api_url': item.api_url
                    })
                }
            })
            
        },
        onSubmit() {
            this.form.project_id = db.getItem('id')
            create_test_api(this.form).then(res =>{
                
            })
            this.$message.success('提交成功！');
        },
    }
};
</script>