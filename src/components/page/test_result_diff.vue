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
        <el-aside>
          Component:
          <el-select
            v-model="selected_index"
            placeholder="Select Component"
            class="handle-select mr10"
          >
            <el-option
              v-for="item in index_items"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-aside>
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
            >Search</el-button
          >
        </el-footer>
      </el-container>

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
              v-for="(item, index) in tableDataHeader"
              :key="index"
              :prop="item.prop"
              :label="item.col"
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
  fetchDetails,
  fetchTestrunList,
  fetchIndexList,
} from "../../api/data_provider";
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
      testrun_list: [],
      index_items: [],
      testrun_items: [],
      selected_index: "",
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
    selected_index: function(value) {
      this.selected_testrun = null;
      this.getTestrunList();
    },
  },
  created() {
    this.getData();
    // this.getTestrunList()
    this.getIndexList();
  },
  computed: {
    data() {
      return this.tableData;
    },
  },
  methods: {
    // 获取 test result 数据
    getData(params) {
      fetchDiffData(params).then((res) => {
        this.tableData = res.data.data;
        var testruns = res.data.testruns;
        this.tableDataHeader = Array();
        for (var i = 0; i < testruns.length; i++) {
          this.tableDataHeader.push({
            col: testruns[i],
            prop: "results[" + i + "].result",
          });
        }
        // console.info(this.tableData)
        // console.info(this.total_num)
        // this.load_select_items()
      });
    },
    getTestrunList() {
      if (!this.selected_index) return;
      var params = {
        index: this.selected_index,
        id_only: "true",
      };
      fetchTestrunList(params).then((res) => {
        var testruns = res.data.data;
        this.testrun_items = new Array();
        for (var key of testruns) {
          this.testrun_items.push({ key: key, label: key });
        }
      });
    },
    getIndexList() {
      fetchIndexList().then((res) => {
        var indices = res.data.data;
        this.index_items = new Array();
        for (var key of indices) {
          this.index_items.push({ key: key, value: key });
        }
        if (this.index_items.length === 1) {
          this.selected_index = this.index_items[0].value;
        }
        // this.getTestrunList()
      });
    },
    load_select_items() {
      //useless for now, this need fetch all data, it's too large
      var testruns = {};
      var components = {};
      this.index_items = new Array();
      this.testrun_items = new Array();
      for (let t of this.tableData) {
        testruns[t.testrun_id] = t.testrun_id;
        components[t.index] = t.index;
      }
      for (var key in testruns) {
        this.testrun_items.push({ key: key, label: testruns[key] });
      }
      for (var key in components) {
        this.index_items.push({ key: key, value: components[key] });
      }
      if (this.index_items.length === 1) {
        this.selected_index = this.index_items[0].value;
      }
    },
    search() {
      var params = {};
      if (this.selected_index) {
        params["index"] = this.selected_index;
      }
      if (this.selected_testrun_list) {
        params["testruns"] = this.selected_testrun_list.join(",");
      }
      this.getData(params);
    },

    handleDetails(index, row) {
      // this.form = JSON.parse(JSON.stringify(row))
      var params = {};
      if (this.selected_index) {
        params["index"] = this.selected_index;
      }
      params["testrun_id"] = row["testrun_id"];
      params["case_id"] = row["case_id"];
      params["details"] = true;
      fetchDetails(params).then((res) => {
        this.details = res.data.data[0];
      });
      this.detailsVisible = true;
    },
  },
};
</script>

<style scoped>
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
