import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token-Portrait'
const UserIdKey = 'Admin-UserId-Portrait'
const TenantIdKey = 'Admin-TenantId-Portrait'
const InitflagKey = 'Admin-InitflagKey-Portrait'
const UserNameKey = 'Admin-UserName-Portrait'
const UserBoxKey = 'Admin-UserBox'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}
export function getTenantId() {
  return Cookies.get(TenantIdKey)
}
export function getInitflag() {
  return Cookies.get(InitflagKey)
}

export function getBox() {
  return Cookies.get(UserBoxKey)
}

export function setBox(box) {
  return Cookies.set(UserBoxKey, box)
}
export function removeBox() {
  return Cookies.remove(UserBoxKey)
}

export function setUserId(userId) {
  return Cookies.set(UserIdKey, userId)
}
export function setTenantId(tenantId) {
  return Cookies.set(TenantIdKey, tenantId)
}
export function setInitflag(initFlag) {
  return Cookies.set(InitflagKey, initFlag)
}

export function getUserName() {
  return Cookies.get(UserNameKey)
}

export function setUserName(userName) {
  return Cookies.set(UserNameKey, userName)
}

export function getWeekData(e) { //获得上周周一~周日的年月日  
  var week = {};
  var date = new Date();
  // 上周一的日期
  date.setDate(date.getDate() - (7 * e) - date.getDay() + 1);
  week.start_day = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  // 上周日的日期
  date.setDate(date.getDate() + 6 - (7 * e));
  week.end_day = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return week
}

export function getday(e) { //获得上周周一~周日的年月日  
  // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
  var date = new Date(e);
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  // 拼接
  var result = year + "" + month + "" + day;
  // 返回
  return result;
}


/****
 * 下载到excel
 ****/
export function export2Excel(theadData, tbodyData, dataname) {
  let idTmr;
  const getExplorer = () => {
    let explorer = window.navigator.userAgent;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
      return "ie";
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
      return "Firefox";
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
      return "Chrome";
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
      return "Opera";
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
      return "Safari";
    }
  };
  // 判断浏览器是否为IE
  const exportToExcel = (data, name) => {
    // 判断是否为IE
    if (getExplorer() == "ie") {
      tableToIE(data, name);
    } else {
      tableToNotIE(data, name);
    }
  };

  const Cleanup = () => {
    window.clearInterval(idTmr);
  };

  // ie浏览器下执行
  const tableToIE = (data, name) => {
    let curTbl = data;
    let oXL = new ActiveXObject("Excel.Application");

    //创建AX对象excel
    let oWB = oXL.Workbooks.Add();
    //获取workbook对象
    let xlsheet = oWB.Worksheets(1);
    //激活当前sheet
    let sel = document.body.createTextRange();
    sel.moveToElementText(curTbl);
    //把表格中的内容移到TextRange中
    sel.select;
    //全选TextRange中内容
    sel.execCommand("Copy");
    //复制TextRange中内容
    xlsheet.Paste();
    //粘贴到活动的EXCEL中

    oXL.Visible = true;
    //设置excel可见属性

    try {
      let fname = oXL.Application.GetSaveAsFilename(
        "Excel.xls",
        "Excel Spreadsheets (*.xls), *.xls"
      );
    } catch (e) {
      print("Nested catch caught " + e);
    } finally {
      oWB.SaveAs(fname);

      oWB.Close((savechanges = false));
      //xls.visible = false;
      oXL.Quit();
      oXL = null;
      // 结束excel进程，退出完成
      window.setInterval("Cleanup();", 1);
      idTmr = window.setInterval("Cleanup();", 1);
    }
  };

  // 非ie浏览器下执行
  const tableToNotIE = (function () {
    // 编码要用utf-8不然默认gbk会出现中文乱码
    let uri = "data:application/vnd.ms-excel;base64,",
      template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = (s, c) => {
        return s.replace(/{(\w+)}/g, (m, p) => {
          return c[p];
        });
      };
    return (table, name) => {
      let ctx = {
        worksheet: name,
        table
      };

      //创建下载
      let link = document.createElement("a");
      link.setAttribute("href", uri + base64(format(template, ctx)));

      link.setAttribute("download", name);

      // window.location.href = uri + base64(format(template, ctx))

      link.click();
    };
  })();
  let re = /http/; // 字符串中包含http,则默认为图片地址
  let th_len = theadData.length; // 表头的长度
  let tb_len = tbodyData.length; // 记录条数
  let width = 120; // 设置图片大小
  let height = 120;

  // 添加表头信息
  let thead = "<thead><tr>";
  for (let i = 0; i < th_len; i++) {
    thead += "<th>" + theadData[i] + "</th>";
  }
  thead += "</tr></thead>";

  // 添加每一行数据
  let tbody = "<tbody>";
  for (let i = 0; i < tb_len; i++) {
    tbody += "<tr>";
    let row = tbodyData[i]; // 获取每一行数据

    for (let key in row) {
      if (re.test(row[key])) {
        // 如果为图片，则需要加div包住图片
        //
        tbody +=
          '<td style="width:' +
          width +
          "px; height:" +
          height +
          'px; text-align: center; vertical-align: middle"><div style="display:inline"><img src=\'' +
          row[key] +
          "' " +
          " " +
          // "width=" +
          // '"' +
          // width +
          // '"' +
          // " " +
          "height=" +
          '"' +
          height +
          '"' +
          "></div></td>";
      } else {
        tbody += '<td style="text-align:center">' + row[key] + "</td>";
      }
    }
    tbody += "</tr>";
  }
  tbody += "</tbody>";

  let table = thead + tbody;

  // 导出表格
  exportToExcel(table, dataname);
}
