<script type="text/javascript">
const pageSizeKey = "pageSize";
const currentPageKey = "currentPage";

export default {
  pageSizeKey,
  currentPageKey,
  ws: {},
  setWs: function(newWs) {
    this.ws = newWs;
  },
  wsType: {},
  setWsType: function(open) {
    this.wsType = open;
  },
  sysList: {},
  setSysList: function(list) {
    this.sysList = list;
  },
  code: "",
  setCode: function(code) {
    this.code = code;
  },
  downloadShow:false,
  zipShow:false,
  successInfo:"",
  failedInfo:"",
  downloadVideo:function(vieloList){
    console.log(111111,vieloList)
  }
};
</script>
