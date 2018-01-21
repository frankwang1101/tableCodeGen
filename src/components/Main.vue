/* eslint-disable */
<template>
  <div class="wrap">
    <Steps :current="step">
      <Step title="请粘贴要转换的内容"></Step>
      <Step title="请设置要转换的格式"></Step>
      <Step title="获取模板"></Step>
    </Steps>
    <div class="win">
      <Card v-show="step === 0" class="card">
        <Row>
          <Col span="16">
          <span class="label">内容框</span>
          <Input v-model="words" style="height: 220px;margin-right:50px" :rows="10" type="textarea"></Input>
          </Col>
          <Col span="7" offset="1">
          <span class="label">模板框</span>
          <Input v-model="execTmpl" style="height: 220px" :rows="10" type="textarea"></Input>
          </Col>
        </Row>
      </Card>
      <Card v-show="step === 1" class="card">
        <Row>
          <Col span="6" offset="18">
            <Row>
              <Input placeholder="格式 name|value" v-model="currentAdd" v-if="addVisible"></Input>
            <Button @click="rowAdd" >{{addVisible?'确定':'添加'}}</Button>
            </Row>
          </Col>
        </Row>
        <Form ref="form" :model="form" :label-width="80" style="width: 100%">
          <FormItem v-for="(item, index) in form.items" :key="index" style="width:100%">
            <Row>
              <Col span="3">
              <Input v-model="item.value" ></Input>
              </Col>
            
            <Col span="1">
            <Input v-model="item.span"></Input>
            </Col>
              <Col span="3">
              <Select v-model="item.type" @change="selectChange">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              </Col>
              <Col span="5">
              <i-switch v-model="item.show" size="large">
                <span slot="open">显示</span>
                <span slot="close">隐藏</span>
              </i-switch>
              <i-switch v-model="item.isAdd" size="large">
                <span slot="open">Add</span>
                <span slot="close">Not</span>
              </i-switch>
              <i-switch v-model="item.isSearch" size="large">
                <span slot="open">搜索</span>
                <span slot="close">不搜</span>
              </i-switch>
              </Col>
              <Col span="3">
              <Button type="primary" disabled  @click="openRuleModal(item.id)">设置校验规则</Button>
              </Col>
              <Col span="4" offset="1">
              <Button type="primary" shape="circle" @click="remove(index)" icon="close-round"></Button>
              <Button type="primary" shape="circle" v-show="checkMoveBtn(index, 'up')" @click="move(index, 'up')" icon="chevron-up"></Button>
              <Button type="primary" shape="circle" v-show="checkMoveBtn(index, 'down')" @click="move(index, 'down')" icon="chevron-down"></Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Card>
      <Card v-show="step === 2" class="card">
        <Row>
          <Col span="6"> 是否显示checked
          <i-switch v-model="isChecked" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          </Col>
          <Col span="6"> 是否改动列
          <i-switch v-model="isColChange" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          </Col>
          <Col span="6"> 是否分页
          <i-switch v-model="isPage" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          </Col>
          <Col span="12"> 文件名
          <Input type="text" v-model="fileName" placeholder="Enter name..."></Input>
          </i-switch>
          </Col>
        </Row>

      </Card>
      <Row>
        <Button v-show="emptyShow" @click="handleOperate('empty')">清空</Button>
        <Button v-show="prevShow" @click="handleOperate('prev')">上一步</Button>
        <Button v-show="nextShow" @click="handleOperate('next')" type="primary">下一步</Button>
        <Button v-show="finishShow" @click="handleOperate('complete')" type="primary">完成</Button>
        <Button v-show="url !== ''" @click="handleOperate('download')" type="primary">下载</Button>
      </Row>
      <Modal :visible.sync="selectModal" title="校验规则填写">
        <Row v-for="(item, key) in selectOpt" :key="key">
          <Col span="10" style="text-align:center;">
          <Input type="text" v-model="item.key"></Input>
          </Col>
          <Col span="10" style="text-align:center;">
          <Input type="text" v-model="item.value"></Input>
          </Col>
          <Col span="2" style="text-align: center" offset="2">
          <i-button type="primary" shape="circle" icon="minus" @click="removeOption(item.id)"></i-button>
          </Col>
        </Row>
        <Row>
          <Button v-show="emptyShow" @click="newOption">添加</Button>
          <Button v-show="prevShow" @click="completeOption">完成</Button>
          <!-- <Button v-show="prevShow" @click="clearOption">清除</Button> -->
        </Row>
      </Modal>
      <Modal :visible.sync="ruleModal" title="校验规则填写">
        <i-form ref="form-validate" :model="rule" :label-width="80">
          <Form-item label="类型" prop="type">
            <i-select :model.sync="rule.type">
              <i-option value="string">Str</i-option>
              <i-option value="number">Num</i-option>
              <i-option value="date">Date</i-option>
              <i-option value="email">Email</i-option>
            </i-select>
          </Form-item>
          <Form-item label="触发方式" prop="trigger">
            <i-select :model.sync="rule.trigger">
              <i-option value="blur">blur</i-option>
            </i-select>
          </Form-item>
          <Form-item label="范围">
            <Row>
              <i-col span="11">
                <Form-item prop="start">
                  <i-input :value.sync="rule.start"></i-input>
                </Form-item>
              </i-col>
              <i-col span="2" style="text-align: center">-</i-col>
              <i-col span="11">
                <Form-item prop="end">
                  <i-input :value.sync="rule.end"></i-input>
                </Form-item>
              </i-col>
            </Row>
          </Form-item>
          <Form-item label="必填">
            <Switch :checked.sync="rule.required" size="large">
              <span slot="true">是</span>
              <span slot="false">否</span>
            </Switch>
          </Form-item>
          <Form-item label="提醒内容" prop="msg">
            <i-input :value.sync="rule.msg" placeholder="请输入..."></i-input>
          </Form-item>
          <Form-item>
            <i-button type="primary" @click="handleSubmit('rule')">确认</i-button>
            <i-button type="ghost" @click="handleReset('rule')" style="margin-left: 8px">重置</i-button>
          </Form-item>
        </i-form>
      </Modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const genId = prefix => {
  return `${prefix || ""}${Date.now()}`;
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
      opts: []
    };
  },
  mounted() {
    debugger;
    console.log(this.ccc_);
    console.log(this.NEEDAUTHCHECK__);
    console.log(this.$router);
    console.log(this.$route);
    let execTmpl = localStorage.getItem("___execTmpl");
    if (execTmpl) {
      this.execTmpl = execTmpl;
    }
  },
  methods: {
    rowAdd() {
      if (this.addVisible) {
        debugger
        if (/^.+\|.+$/.test(this.currentAdd)) {
          let res = this.currentAdd.split("|");
          this.form.items.push({
            id: genId(),
            key: res[0],
            value: res[1],
            type: "input",
            show: false,
            isAdd: true,
            isSearch: false,
            seq: this.form.items.length,
            rule: {},
            span: 16,
            listName: ""
          });
        }
      }
      this.addVisible = !this.addVisible
    },
    newOption() {
      this.selectOpt.push({
        id: genId("opt"),
        key: "",
        value: ""
      });
    },
    completeOption() {
      let target = this.form.items.find(v => v.id === this.activeId);
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
    handleSubmit(name) {
      let target = this.form.items.find(v => v.id === this.activeId);
      let r = Object.assign(
        {},
        {
          type: this.rule.type,
          trigger: this.rule.trigger,
          required:
            this.rule.required === true || this.rule.required === "true",
          message: this.rule.msg,
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
          if (!r.start) {
            delete r.max;
          }
          if (!r.end) {
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
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    remove(idx) {
      this.form.items.splice(idx, 1);
    },
    checkMoveBtn(idx, type) {
      if (type === "up" && idx === 0) {
        return false;
      } else if (type === "down" && idx === this.form.items.length - 1) {
        return false;
      }
      return true;
    },
    move(idx, type) {
      let num = type === "up" ? -1 : 1;
      let target = this.form.items[idx];
      let switchOne = this.form.items[idx + num];
      target.seq += num;
      switchOne.seq -= num;
      if (num > 0) {
        this.form.items.splice(idx, 2, switchOne, target);
      } else {
        this.form.items.splice(idx - 1, 2, target, switchOne);
      }
    },
    _renderDatas() {
      debugger;
      let word = JSON.parse(this.words);
      let execObj = JSON.parse(this.execTmpl);
      let key = execObj.key;
      let value = execObj.value;

      let names = key.split(".");
      let last = "";
      last = names.pop();
      let obj = word;
      let datas = [];
      while (names.length > 0) {
        obj = obj[names.shift()];
      }
      if (!obj) {
        obj = word;
      }
      if (last !== "__NAME__" && obj instanceof Array) {
        datas = obj.map((v, idx) => {
          return {
            id: genId(),
            key: v[last],
            value: v[value],
            type: "input",
            show: false,
            isAdd: true,
            isSearch: false,
            seq: idx,
            rule: {},
            span: 16,
            listName: ""
          };
        });
      } else {
        let keys = Object.keys(obj);
        if (value !== "__STR") {
          keys = keys.filter(v => typeof obj[v] === "object");
        }
        datas = keys.map((v, idx) => ({
          id: genId(),
          key: v,
          value: value !== "__STR" ? obj[v][value] : obj[v],
          type: "input",
          show: false,
          isAdd: true,
          isSearch: false,
          seq: idx,
          rule: {},
          span: 16,
          listName: ""
        }));
      }
      this.form.items = datas;
    },
    handleOperate(type) {
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
            if (!this.words || !this.execTmpl) {
              this.$Notice.open({
                title: "提醒",
                desc: "请填写内容框和模版框"
              });
              break;
            } else {
              localStorage.setItem("___execTmpl", this.execTmpl);
              this._renderDatas();
            }
          } else {
            this.result = JSON.stringify({
              data: this.form.items,
              add: this.form.items.filter(v => v.isAdd)
            });
          }
          this.step++;
          break;
        }
        case "complete": {
          let chooseIdx = [];
          let search = [];
          this.form.items.forEach((v, i) => {
            if (v.show) {
              chooseIdx.push(i);
            }
            if (v.isSearch) {
              search.push({
                key: v.key,
                value: v.value
              });
            }
          });
          let result = {
            data: this.form.items,
            addData: this.form.items.filter(v => v.isAdd),
            checked: this.isChecked,
            col: this.isColChange,
            chooseIdx: chooseIdx.join(","),
            isPage: this.isPage,
            search
          };
          let fileName = this.fileName;
          let params = new URLSearchParams();
          debugger;
          params.append("data", JSON.stringify(result));
          let self = this;
          axios
            .post(`http://localhost:3000/receive`, {
              params: JSON.stringify(result)
            })
            .then(res => {
              if (res.data.success) {
                self.url = `http://localhost:3000/download?filename=${fileName}`;
              }
            });
          break;
        }
        case "download": {
          window.open(this.url, "__BLANK");
          break;
        }
        default:
          break;
      }
    }
  },
  computed: {
    emptyShow() {
      return this.step === 0;
    },
    prevShow() {
      return this.step > 0;
    },
    nextShow() {
      return this.step < 2;
    },
    finishShow() {
      return this.step === 2;
    }
  },
  watch: {
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
</style>
