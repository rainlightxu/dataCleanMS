<template>
  <div class="app-container">
    <!-- 卡片视图 -->
    <el-row :gutter="50">
      <el-col :span="8" v-for="(item,index) in list" :key="index">
        <a :href="item.link" :target="item.link !== '#' ? '_blank' : ''">
          <div class="box" :style="'background-color:'+item.color">
            <img :src="item.icon" />
            <div class="title-inbox">
              <h1>{{item.title}}</h1>
            </div>
          </div>
        </a>
      </el-col>
    </el-row>
    <!-- <div class="dashboard-container">
      <div v-for="(item, index) in images" :key="index" class="image-container">
        <a :href="item.link" :target="item.link !== '#' ? '_blank' : ''">
          <img :src="item.pic" />
        </a>
      </div>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          icon: require("../../assets/dashboard/小图标1.png"),
          title: "Purchasing Forecast and Actual Tracking Report",
          link:'#',
          color:'#4472C4'
        },
        {
          icon: require("../../assets/dashboard/小图标3.png"),
          title: "Inventory Structure Analysis Report",
          link: "#",
          color:'#009BD2'
        },
        {
          icon: require("../../assets/dashboard/小图标5.png"),
          title: "Sell-in Forecast and Actual Tracking Report",
          link: "#",
          color:'#00863D'
        },
        {
          icon: require("../../assets/dashboard/小图标2.png"),
          title: "Sell-out Forecast and Actual Tracking Report",
          link: "#",
          color:'#4472C4'
        },
        {
          icon: require("../../assets/dashboard/小图标4.png"),
          title: "Channel Inventory Analysis Report",
          link: "#",
          color:'#009BD2'
        },
        // {
        //   icon: require("../../assets/dashboard/小图标6.png"),
        //   title: "Gover. Reports",
        //   link: "",
        //   color:'#00863D'
        // },
      ],
      images: [
        {
          pic: require("../../assets/dashboard/1.png"),
          link:
            "https://app.powerbi.com/view?r=eyJrIjoiMGZlNDkwZjctYzQ0Ny00ZDRkLTk2YjEtN2Q0ZDljMWEwODJmIiwidCI6ImNkNWJjZTk2LWZjNTAtNGFjOC04ZjUxLTJmZGEwNTIxODZiNSIsImMiOjEwfQ%3D%3D&pageName=ReportSection",
        },
        { pic: require("../../assets/dashboard/3.png"), link: "#" },
        { pic: require("../../assets/dashboard/5.png"), link: "#" },
        {
          pic: require("../../assets/dashboard/2.png"),
          link:
            "https://app.powerbi.com/view?r=eyJrIjoiYzk4OWI1ZDEtNTMwMy00MjFlLTlhNTMtMTUzZDJiODE4N2FkIiwidCI6ImNkNWJjZTk2LWZjNTAtNGFjOC04ZjUxLTJmZGEwNTIxODZiNSIsImMiOjEwfQ%3D%3D&pageName=ReportSection",
        },
        { pic: require("../../assets/dashboard/4.png"), link: "#" },
        {
          pic: require("../../assets/dashboard/6.png"),
          link:
            "https://app.powerbi.com/view?r=eyJrIjoiZDY3NDhiNzAtYWFmMi00MDc5LThhY2ItNmE5MWQ3NmQ4NzA1IiwidCI6ImNkNWJjZTk2LWZjNTAtNGFjOC04ZjUxLTJmZGEwNTIxODZiNSIsImMiOjEwfQ%3D%3D&pageName=ReportSection68d18e0203981a30bf68",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  // padding: 100px 100px 50px;
  height: calc(100vh - 70px);
  // background: url('../../assets/dashboard/bg.png');
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-position:bottom;
}
.el-row {
}
.el-col {
  padding: 35px;
}
.box {
  height: 180px;
  width: 300px;
  padding: 15px;
  margin: 0 auto;
  border-radius: 40px;
  display: inline-block;
  background-color: #04c7d1;
  display: flex;
  align-items: center;
  .title-inbox {
    margin-left: 15px;
    h1 {
      margin: 0;
      color: #fff;
      font-size: 20px;
      font-weight: 600;
    }
  }
}
img {
  // width: 50px;
  height: 50px;
}
.el-card {
  padding: 0 !important;
  margin: 0;
}
.el-row {
  // margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.right-button {
  font-size: 30px !important;
  margin-left: -3px;
}
.dashboard-container {
  padding: 0 0 0 15px;
  // height: 75%;
  height: 450px;
  // width: 60%;
  width: 900px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.image-container {
  display: flex;
  flex-wrap: wrap;
  width: 33.3%;
  text-align: center;
  img {
    // width: 80%;
    width: 250px;
    // height: 124px;
  }
  a {
    margin: 0 auto;
  }
}
@media screen and (max-width: 1366px) {
  .app-container {
    // padding: 100px 50px 50px;
  }
}
@media screen and (max-width: 1365px) {
  .box {
    width: 250px;
    height: 150px;
  }
}
</style>