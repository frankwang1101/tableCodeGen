<template lang="pug">
.wrap
  Steps(:current="step")
    Step(title="请粘贴要转换的内容")
    Step(title="请设置要转换的格式")
    Step(title="获取模板")
  .win
    Card.card(v-show="step===0")
      Row
        Col(span="12", offset="6")
          Upload(
            multiple
            type="drag"
            action="/"
            :before-upload="upload"
          )
            div(style="padding:20px 0;")
              Icon.ios-cloud-upload(size="52", style="color: #3399ff")
              p 点击或拖拽上传配置文件
      Row
        div(style="text-decoration: underline;margin:0 auto;cursor: pointer", @click="configFetch") 配置文件模板
    Card.card(v-show="step===1")
      //- Row
      //-   Col(span="6", offset="18")
      //-     Row
      //-       Input(
      //-         placeholder="格式 name|value"
      //-         v-model="currentAdd"
      //-         v-if="addVisible"
      //-       )
      //-       Button(@click="rowAdd") {{addVisible?'确定':'添加'}}
      Form(
        ref="form"
        :model="form"
        :label-width="80"
        style="width: 100%"
      )
        FormItem(v-for="(item, index) in columns", :key="index", style="width:100%")
          Row
            Col(span="3")
              Input(v-model="item.prop")
            Col(span="1")
              Input(v-model="item.label")
            Col(span="3")
              Select(v-model="item.type", @change="selectChange", style="width: 100px")
                Option(v-for="item in typeList", :value="item.value", :key="item.value") {{ item.label }}
            Col(span="1")
              Button(type="primary",
                v-show="item.type === 'select'",
                shape="circle",
                size="small",
                @click="modifyList(item.opts, item.prop)") Opt
            Col(span="6")
              i-switch( v-model="item.list" size="large")
                span(slot="open") list
                span(slot="close") no
              i-switch( v-model="item.show", size="large")
                span(slot="open") show
                span(slot="close") no
              i-switch( v-model="item.isAdd", size="large")
                span(slot="open") isAdd
                span(slot="close") no
              i-switch( v-model="item.isSearch", size="large")
                span(slot="open") isSearch
                span(slot="close") no
            Col(span="3")
              Button(type="primary"  @click="openRuleModal(item.id)") 设置校验规则
            Col(span="4")
              Button(type="primary", shape="circle", @click="remove(index)", icon="close-round")
              Button(type="primary", shape="circle", v-show="checkMoveBtn(index, 'up')", @click="move(index, 'up')" icon="chevron-up")
              Button(type="primary", shape="circle", v-show="checkMoveBtn(index, 'down')", @click="move(index, 'down')" icon="chevron-down")
    Card.card(v-show="step===2")
      Row
        Col(span="6") 是否显示checked
          i-switch(v-model="isChecked", size="large")
            span(slot="open") 是
            span(slot="close") 否
        //- Col(span="6") 是否改动列
        //-   i-switch(v-model="isColChange", size="large")
        //-     span(slot="open") 是
        //-     span(slot="close") 否
        Col(span="6") 是否分页
          i-switch(v-model="isPage", size="large")
            span(slot="open") 是
            span(slot="close") 否
        Col(span="12") 文件名
          Input(type="text", v-model="fileName", placeholder="Enter name...")
    Row
      Button(v-show="emptyShow", @click="handleOperate('empty')") 清空
      Button(v-show="prevShow", @click="handleOperate('prev')") 上一步
      Button(v-show="nextShow", @click="handleOperate('next')", type="primary") 下一步
      Button(v-show="finishShow", @click="handleOperate('complete')", type="primary") 完成
      Button(v-show="url !== ''", @click="handleOperate('download')", type="primary") 下载
    Modal(v-model="ruleModal", title="校验规则填写")
      i-form(ref="form-validate", :model="rule", :label-width="80")
        Form-item(label="类型", prop="type")
          i-select(v-model="rule.type")
            i-option(value="string") Str
            i-option(value="number") Num
            i-option(value="date") Date
            i-option(value="email") Email
        Form-item(label="触发方式", prop="trigger")
          i-select(v-model="rule.trigger")
            i-option(value="blur") blur
        Form-item(label="范围")
          Row
            i-col(span="11")
              Form-item(prop="start")
                i-input(v-model="rule.start")
            i-col(span="2", style="text-align: center") -
            i-col(span="11")
              Form-item(prop="end")
                i-input(v-model="rule.end")
        Form-item(label="必填")
          i-switch(v-model="rule.required" size="large")
            span(slot="open") 是
            span(slot="close") 否
        Form-item(prop="msg", label="提醒内容")
          i-input(v-model="rule.msg", placeholder="请输入")
        Form-item
          i-button(type="primary" @click="handleSubmitRule") 确认
          i-button(type="ghost" @click="handleReset('rule')" style="margin-left: 8px") 重置
      template(slot="footer")
    Modal(v-model="listModal", title="下拉列表调整")
      ul.opt-list
        li(v-for="(opt, idx) in activeOpts", :key="idx", on-ok="confirmOpt")
          Row.opt-row
            Input.row-input(v-model="opt.value")
            Input.row-input(v-model="opt.label")
            Button.remove(type="primary", shape="circle", @click="removeOpt(idx)", icon="close-round")
      Button.opt-confirm(type="primary", @click="addOpt") 添加

</template>

<script>
import axios from "axios";
import yaml from 'js-yaml'

const genId = prefix => {
  return `${prefix || ""}${Math.random()
    .toString(32)
    .substr(2)}`;
};
const genListName = name => {
  let r1 = /^(.+)Name$/;
  let r2 = /^(.+)Id$/;
  let r3 = /^(.+)V$/;
  let arr = [r1, r2, r3];
  let result = "";
  while (arr.length) {
    let r = arr.shift();
    if (r.test(name)) {
      result = r.exec(name)[1] + "List";
      break;
    }
  }
  if (!result) {
    result = name + "List";
  }
  return result;
};
export default {
  name: "HelloWorld",
  data() {
    return {
      step: 0,
      form: {
        items: []
      },
      columns: [],
      currentAdd: "",
      addVisible: false,
      typeList: [
        { value: "input", label: "input" },
        { value: "select", label: "select" },
        { value: "date", label: "date" },
        { value: "switch", label: "switch" },
        { value: "textarae", label: "textarae" },
        { value: "auto", label: "auto" }
      ],
      words: "",
      NEEDAUTHCHECK__: true,
      execTmpl: "",
      result: "",
      isChecked: true,
      isColChange: true,
      fileName: "",
      url: "",
      isPage: true,
      ruleModal: false,
      activeOptId: '',
      listModal: false,
      selectModal: false,
      rule: {
        type: "",
        trigger: "",
        start: "",
        end: "",
        required: "",
        msg: ""
      },
      selectOpt: [],
      activeId: "",
      opts: [],
      config: null,
      activeOpts: []
    };
  },
  mounted() {
    let execTmpl = localStorage.getItem("___execTmpl");
    if (execTmpl) {
      this.execTmpl = execTmpl;
    }
  },
  methods: {
    download(url, name) {
      const a = document.createElement('a')
      a.download = name
      a.href = url
      a.style.visibility = 'hidden'
      a.style.position = 'absolute'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    configFetch() {
      this.download('/config.yml', 'config.yml')
    },
    addOpt() {
      this.activeOpts.push({
        label: '',
        value: ''
      })
    },
    confirmOpt() {
      this.columns = this.columns.map(col => {
        if (col.prop === this.activeOptId) {
          return {
            ...col,
            opts: this.activeOpts
          }
        }
        return col
      })
    },
    modifyList(opts, id) {
      this.activeOpts = opts.map((o, idx) => ({
        ...o,
        id: Math.random().toString(32) + idx
      }))
      this.activeOptId = id
      this.listModal = true
    },
    upload(file) {
      const reader = new FileReader()
      reader.addEventListener('loadend', () => {
        this.resolveYaml(reader.result)
      })
      reader.readAsText(file)
      return false
    },
    resolveYaml(text) {
      try {
        const doc = yaml.safeLoad(text, 'utf-8')
        this.handleOperate('next', doc)
      } catch (e) {
        console.log(e);
      }
    },
    openRuleModal(id) {
      debugger
      this.ruleModal = true;
      this.activeId = id;
      this.rule = this.columns.find(i => i.id === id).rule
      this.$refs["form-validate"].resetFields();
      console.log("now active", id);
    },
    rowAdd() {
      if (this.addVisible) {
        if (/^.+\|.+$/.test(this.currentAdd)) {
          let res = this.currentAdd.split("|");
          this.columns.push({
            id: genId(),
            key: res[0],
            value: res[1],
            type: "input",
            show: false,
            isAdd: true,
            isSearch: false,
            seq: this.columns.length,
            rule: {},
            span: 16,
            listName: ""
          });
        }
      }
      this.addVisible = !this.addVisible;
    },
    newOption() {
      this.selectOpt.push({
        id: genId("opt"),
        key: "",
        value: ""
      });
    },
    completeOption() {
      let target = this.columns.find(v => v.id === this.activeId);
      if (target) {
        let name = genListName(target.name);
        target.listName = name;
        this.opts[name] = this.selectOpt.slice();
      }
    },
    removeOption(id) {
      this.selectOpt = this.selectOpt.filter(v => v.id !== id);
    },
    selectChange(value) {
      if (value === "select") {
        this.selectModal = true;
      } else {
        this.selectModal = false;
        this.selectOpt = [];
      }
    },
    handleSubmitRule(name) {
      let target = this.columns.find(v => v.id === this.activeId);
      console.log(this.rule);
      let r = Object.assign(
        {},
        {
          type: this.rule.type,
          trigger: this.rule.trigger,
          required:
            this.rule.required === true || this.rule.required === "true",
          msg: this.rule.msg,
          max: this.rule.start,
          min: this.rule.end
        }
      );
      switch (this.rule.type) {
        case "number": {
          delete r.max;
          delete r.min;
          delete r.type;
          break;
        }
        case "string": {
          delete r.type;
          if (!r.max) {
            delete r.max;
          }
          if (!r.min) {
            delete r.min;
          }
          break;
        }
        case "date":
        case "email": {
          delete r.max;
          delete r.min;
          break;
        }
        default:
          break;
      }
      target.rule = r;
      this.ruleModal = false;
      this.activeId = "";
    },

    handleReset(name) {
      this.$refs[name].resetFields();
    },
    remove(idx) {
      this.columns.splice(idx, 1);
    },
    checkMoveBtn(idx, type) {
      if (type === "up" && idx === 0) {
        return false;
      } else if (type === "down" && idx === this.columns.length - 1) {
        return false;
      }
      return true;
    },
    move(idx, type) {
      let num = type === "up" ? -1 : 1;
      let target = this.columns[idx];
      let switchOne = this.columns[idx + num];
      target.seq += num;
      switchOne.seq -= num;
      if (num > 0) {
        this.columns.splice(idx, 2, switchOne, target);
      } else {
        this.columns.splice(idx - 1, 2, target, switchOne);
      }
    },
    handleOperate(type, data) {
      switch (type) {
        case "empty": {
          this.words = "";
          this.execTmpl = "";
          break;
        }
        case "prev": {
          this.step--;
          break;
        }
        case "next": {
          if (this.step === 0) {
            const obj = data.table
            this.columns = Object.keys(obj).map(key => {
              if (typeof obj[key] === 'string') {
                return {
                  label: obj[key],
                  prop: key,
                  id: key,
                  type: 'input',
                  list: true,
                  isAdd: true,
                  rule: {}
                }
              }
              const item = {
                list: true,
                id: key,
                type: 'input',
                isAdd: true,
                rule: {}
              }
              const set = (obj, key, oobj) => {
                if (oobj[key]) {
                  obj[key] = oobj[key]
                }
              }
              ['prop', 'label', 'list', 'opts', 'show', 'isAdd', 'isSearch', 'id', 'type'].forEach(v => set(item, v, obj[key]))
              return item
            })
          } else {
            this.result = JSON.stringify({
              data: this.columns,
              add: this.columns.filter(v => v.isAdd)
            });
          }
          this.step++;
          break;
        }
        case "complete": {
          let chooseIdx = [];
          let chooseName = [];
          let search = [];
          let opts = []
          this.columns.forEach((v, i) => {
            if (v.isSearch) {
              search.push({
                prop: v.prop,
                label: v.label
              });
            }
            if (v.opts && v.opts.length) {
              opts.push({
                prop: v.prop,
                list: opts.map(i => ({ [i.key]: i.value })).toString()
              })
            }
          });
          let r = this.columns.filter(v => v.list);
          r.forEach((v, i) => {
            if (v.show) {
              chooseIdx.push(i);
              chooseName.push(v.value)
            }
          });
          let result = {
            data: r,
            addData: this.columns.filter(v => v.isAdd).map((v, i) => {
              return Object.keys(v.rule).length
                ? {
                  ...v,
                  rule: `[${JSON.stringify(v.rule).replace(/"/g, "'")}]`
                }
                : { ...v, rule: false };
            }),
            checked: this.isChecked,
            // col: this.isColChange,
            chooseIdx: chooseIdx.join(","),
            chooseName: chooseName.join(","),
            isPage: this.isPage,
            search
          };
          let fileName = this.fileName;
          let params = new URLSearchParams();
          console.log(result, "pdata");
          params.append("data", JSON.stringify(result));
          let self = this;
          axios
            .post(`http://172.25.40.44:3000/receive`, result)
            .then(res => {
              if (res.data.success) {
                self.url = `http://172.25.40.44:3000/download?filename=${fileName}`;
              }
            });
          break;
        }
        case "download": {
          this.download(this.url, this.fileName)
          break;
        }
        default:
          break;
      }
    }
  },
  computed: {
    emptyShow() {
      return false;
    },
    prevShow() {
      return this.step > 0;
    },
    nextShow() {
      return this.step < 2 && this.step > 0;
    },
    finishShow() {
      return this.step === 2;
    }
  },
  watch: {
    listModal(val) {
      if (!val) {
        this.activeOptId = ''
        this.activeOpts = []
      }
    },
    addVisible(v) {
      if (!v) {
        this.currentAdd = "";
      }
    }
  }
};
</script>

<style scoped>
.label {
  font-size: 20px;
}

.card {
  margin: 40px;
  padding: 10px;
}
.wrap {
  width: 1280px;
  margin: 0 auto;
}
.opt-row{
  display: flex;
  margin-top: 10px;
}
.opt-row .row-input{
  margin-right: 30px;
}
.opt-row .remove{
  flex-shrink: 0
}
.opt-confirm{
  margin-top: 20px;
}
</style>
