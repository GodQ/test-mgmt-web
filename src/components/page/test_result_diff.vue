<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          ><i class="el-icon-lx-cascades"></i> Test Result
          Diff</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div>
      <el-container>
        <div>
                Project:
                <el-select v-model="selected_project" placeholder="Select Project" class="handle-select mr10">
                    <!-- <el-option key="1" label="godq" value="godq"></el-option> -->
                    <el-option
                        v-for="item in project_items"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
                Test Suite:
                <el-select v-model="selected_suite" placeholder="Select Test Suite" class="handle-select mr10">
                    <el-option
                        v-for="item in project_suites"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                Test Environment:
                <el-select v-model="selected_env" placeholder="Select Test Environment" class="handle-select mr10">
                    <el-option
                        v-for="item in project_envs"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                
        </div>
        <el-divider><i class="el-icon-bottom"></i></el-divider>
        <el-main>
          <div>Add TestRun to Diff:</div>
          <el-transfer
            filterable
            filter-placeholder="Search Test Run"
            :titles="['Test Run List', 'Selected Test Runs']"
            v-model="selected_testrun_list"
            :data="testrun_items"
          >
          </el-transfer>
        </el-main>
        <el-footer>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >Analyze</el-button
          >
        </el-footer>
      </el-container>

      <el-divider><i class="el-icon-bottom"></i></el-divider>

      <div>
          Test Run Result Summary:
          <el-table :data="testrun_summary" 
              border class="table" ref="multipleTable" >
                <el-table-column prop="testrun_id" label="testrun_id" column-key="testrun_id" sortable>
                </el-table-column>
                <el-table-column prop="case_count" label="case_count" column-key="case_count" sortable>
                </el-table-column>
                <el-table-column prop="success_rate" label="success_rate" column-key="success_rate" sortable>
                </el-table-column>
                <el-table-column prop="error" label="error" column-key="error">
                </el-table-column>
                <el-table-column prop="failure" label="failure" column-key="failure">
                </el-table-column>
                <el-table-column prop="success" label="success" column-key="success">
                </el-table-column>
                
            </el-table>
      </div>

      <el-divider><i class="el-icon-bottom"></i></el-divider>

      <div>
        Diff Analysis Result:
        <el-main>
          <el-table :data="tableData" border class="table" ref="multipleTable" >
            <el-table-column
              prop="case_id"
              label="case_id"
              column-key="case_id"
              sortable
            >
            </el-table-column>
            <el-table-column
              v-for="(item, project_id) in tableDataHeader"
              :key="project_id"
              :prop="item.prop"
              :label="item.col"
              sortable
            >
            </el-table-column>
          </el-table>
        </el-main>
      </div>
    </div>

    <!-- 详细信息弹出框 -->
    <el-dialog title="Details" :visible.sync="detailsVisible" width="60%">
      <el-form ref="details" :model="details" label-width="100px">
        <el-form-item label="TestCase id">
          <el-input v-model="details.case_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="TestRun id">
          <el-input v-model="details.testrun_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Env">
          <el-input v-model="details.env" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Status">
          <el-input v-model="details.case_result" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Bugs">
          <el-input v-model="details.bugs" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Comment">
          <el-input
            v-model="details.comment"
            type="textarea"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="stdout">
          <el-input
            v-model="details.stdout"
            type="textarea"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="Traceback">
          <el-input
            v-model="details.traceback"
            type="textarea"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchDiffData,
  fetchTestResults,
  fetchTestrunList,
  fetchProjectList,
  fetchProjectSettings,
} from "../../api/data_provider_for_test_result";
export default {
  name: "test_result_diff",
  data() {
    return {
      tableDataHeader: [{ col: "testrun id" }], //{col: "testrun id", prop: "results[0].result" }
      tableData: [
        {
          case_id: "case_id",
          results: [],
          // [
          //     {"result": "error","testrun_id": "2020-10-18-07-19-13"},
          //     {"result": "success","testrun_id": "2020-10-17-12-27-34"},
          //     {"result": "success","testrun_id": "2020-10-17-12-27-35"}
          // ]
        },
      ],
      selected_testrun_list: [],
      testrun_summary: [
          {
                "case_count": '',
                "error": '',
                "failure": '',
                "success": '',
                "success_rate": '',
                "testrun_id": "testrun_id"
            }
      ],
      testrun_list: [],
      project_items: [],
      testrun_items: [],
      selected_project: "",
      project_suites: ['all'],
      selected_suite: '',
      project_envs: ['all'],
      selected_env: '',
      detailsVisible: false,
      details: {
        case_id: "",
        testrun_id: "",
        case_result: "",
        bugs: "",
        comment: "",
        env: "",
        stdout: "",
        traceback: "",
      },
    };
  },
  watch: {
            "selected_project": function (value) {
                this.selected_testrun = null
                this.getTestrunList('project')
                this.getProjectSettings()
            },
            "selected_env": function (value) {
                this.selected_testrun = null
                this.getTestrunList('env')
            },
            "selected_suite": function (value) {
                this.selected_testrun = null
                this.getTestrunList('suite')
            },
  },
  created() {
    // this.getTestResults();
    // this.getTestrunList()
    this.getProjectList();
  },
  computed: {
    data() {
      return this.tableData;
    },
  },
  methods: {
    // 获取 test result 数据
    getTestResults(params) {
      fetchDiffData(this.selected_project, params).then((res) => {
        this.tableData = res.data.data;
        var testruns = res.data.testruns;
        this.tableDataHeader = Array();
        for (var i = 0; i < testruns.length; i++) {
          this.tableDataHeader.push({
            col: testruns[i],
            prop: "results[" + i + "].result",
          });
        }
        var testrun_summary = res.data.summary;
        this.testrun_summary = Array();
        for (var i = 0; i < testruns.length; i++) {
          this.testrun_summary.push(testrun_summary[i]);
        }
        // console.info(this.testrun_summary)
        // console.info(this.total_num)
        // this.load_select_items()
      });
    },
    getTestrunList(source) {
      if (!this.selected_project) return;
      var params = {
        project_id: this.selected_project,
        'env':this.selected_env,
        'suite':this.selected_suite,
        id_only: "true",
      };
      fetchTestrunList(this.selected_project, params).then((res) => {
        var testruns = res.data.data;
        if(testruns.length > 0){
          this.testrun_items = new Array();
          for (var key of testruns) {
            this.testrun_items.push({ key: key, label: key });
          }
        }else{
          alert('There is no testrun matched ')
          console.warn('There is no testrun matched for '+ JSON.stringify(params))
          if(source=='env')
            this.selected_env = null
          else if(source=='suite')
            this.selected_suite = null
        }
      });
    },
    getProjectList() {
      fetchProjectList({"id_only": "true"}).then((res) => {
        var indices = res.data.data;
        this.project_items = new Array();
        for (var key of indices) {
          this.project_items.push({ key: key, value: key });
        }
        if (this.project_items.length === 1) {
          this.selected_project = this.project_items[0].value;
        }
        // this.getTestrunList()
      });
    },
    getProjectSettings() {
                fetchProjectSettings(this.selected_project).then((res) => {
                    var envs = res.data.data.envs
                    var suites = res.data.data.suites
                    this.project_envs = new Array()
                    this.project_envs.push('all')
                    for(var key of envs){
                        this.project_envs.push(key)
                    }
                    this.project_suites = new Array()
                    this.project_suites.push('all')
                    for(var key of suites){
                        this.project_suites.push(key)
                    }
                })
            },
    load_select_items() {
      //useless for now, this need fetch all data, it's too large
      var testruns = {};
      var components = {};
      this.project_items = new Array();
      this.testrun_items = new Array();
      for (let t of this.tableData) {
        testruns[t.testrun_id] = t.testrun_id;
        components[t.project_id] = t.project_id;
      }
      for (var key in testruns) {
        this.testrun_items.push({ key: key, label: testruns[key] });
      }
      for (var key in components) {
        this.project_items.push({ key: key, value: components[key] });
      }
      if (this.project_items.length === 1) {
        this.selected_project = this.project_items[0].value;
      }
    },
    search() {
      var params = {};
      if (this.selected_project) {
        params["project_id"] = this.selected_project;
      }
      if (this.selected_testrun_list) {
        params["testruns"] = this.selected_testrun_list.join(",");
      }
      this.getTestResults(params);
    },

    handleDetails(project_id, row) {
      // this.form = JSON.parse(JSON.stringify(row))
      var params = {};
      if (this.selected_project) {
        params["project_id"] = this.selected_project;
      }
      params["testrun_id"] = row["testrun_id"];
      params["case_id"] = row["case_id"];
      params["details"] = true;
      fetchTestResults(this.selected_project, params).then((res) => {
        this.details = res.data.data[0];
      });
      this.detailsVisible = true;
    },
  },
};
</script>

<style>
.el-transfer-panel {
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    overflow: hidden;
    background: #FFF;
    display: inline-block;
    vertical-align: middle;
    width: 300px;
    max-height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
}

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 180px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
