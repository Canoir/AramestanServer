function admin_layout() {
  switch (document.getElementById("pageIdentifire").title) {
    case "users":
      usersPage();
      break;
    case "dash":
      dashboardPage();
      break;
    case "edit":
      editProfilePage();
      break;
    case "deads":
      deadsPage();
      break;
    case "dead":
      deadPage();
      break;
    case "states":
      statesPage();
      break;
    case "deadtypes":
      deadtypesPage();
      break;
    case "deads_add":
      addDeadPage();
      break;
    case "deads_edit":
      editDeadPage();
      break;
    case "costs":
      costsPage();
      break;
    case "deads_additional":
      additionalPage();
      break;
    case "reports":
      reportsPage();
      break;
    case "reports_preview":
      reports_previewPage();
      break;
    case "death_report":
      deathReportPage();
      break;
    case "statements_add":
      statementsAddPage();
      break;
    case "settings":
      settingsPage();
      break;
  }
  document.getElementById("dashboard_item1").onclick = () => {
    window.location.href = "/dashboard";
  };
  document.getElementById("dashboard_item2").onclick = () => {
    window.location.href = "/deads";
  };
  document.getElementById("dashboard_item3").onclick = () => {
    window.location.href = "/users";
  };
  document.getElementById("dashboard_item4").onclick = () => {
    window.location.href = "/users/editme";
  };
  document.getElementById("dashboard_item5").onclick = () => {
    window.location.href = "/logout";
  };
  document.getElementById("dashboard_item6").onclick = () => {
    window.location.href = "/states";
  };
  document.getElementById("dashboard_item7").onclick = () => {
    window.location.href = "/deadtypes";
  };
  document.getElementById("dashboard_item8").onclick = () => {
    window.location.href = "/costs";
  };
  document.getElementById("dashboard_item9").onclick = () => {
    window.location.href = "/reports";
  };
  document.getElementById("dashboard_item10").onclick = () => {
    window.location.href = "/statements/add";
  };
  document.getElementById("dashboard_item11").onclick = () => {
    window.location.href = "/setting";
  };
  Array.prototype.forEach.call(
    document.getElementsByClassName("toPersian"),
    (el) => (el.innerText = toFarsiNumber(el.innerText))
  );
  Array.prototype.forEach.call(
    document.getElementsByClassName("toPrice"),
    (el) => (el.innerText = PersianPriceSpacer(el.innerText, 3))
  );
  Array.prototype.forEach.call(
    document.getElementsByClassName("onInputPrice"),
    (el) => {
      el.addEventListener("input", () => {
        el.value = PersianPriceSpacer(el.value, 3);
      });
    }
  );
}
function usersPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  //
  let popup = document.getElementById("popup");
  let popupContent = document.getElementById("popup_content_1");
  document.getElementById("add").onclick = (e) => {
    e.preventDefault();
    showPopup(popup, popupContent);
  };
  let onPopupContent = false;
  popupContent.onmouseenter = () => {
    onPopupContent = true;
  };
  popupContent.onmouseleave = () => {
    onPopupContent = false;
  };
  popup.onclick = () => {
    if (!onPopupContent) hiddenPopup(popup, popupContent);
  };
  document.getElementById("popup_content_1_btn1").onclick = () => {
    document.getElementById("popup_content_1_form1").submit();
    hiddenPopup(popup, popupContent);
  };
  document.getElementById("popup_content_1_btn2").onclick = () => {
    hiddenPopup(popup, popupContent);
  };
  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_edit_button"),
    (element) => {
      element.onclick = (e) => {
        showPopup(popup, popupContent, JSON.parse(element.id));
      };
    }
  );
  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_remove_button"),
    (element) => {
      element.onclick = (e) => {
        document.getElementById("user_remove_item_id").value = element.id;
        document.getElementById("user_remove_item_form").submit();
      };
    }
  );
  //
  document.title = "کارمند ها";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(6)"
  ).className += " dashboard_panel_item_active";
}
function dashboardPage() {
  setLayoutProperties(
    JSON.parse(document.getElementById("LoggedOnUser").title)
  );
  document.title = "داشبورد";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(1)"
  ).className += " dashboard_panel_item_active";
  axios({
    method: "get",
    url: "/allCount",
  })
    .then((value) => {
      if (value.data.code == "200") {
        document.getElementById("AllCount").innerText = toFarsiNumber(
          value.data.AllCounted
        );
        document.getElementById("AllCounted").innerText = toFarsiNumber(
          value.data.AllCount - value.data.AllCounted
        );
      }
      return axios({ method: "get", url: "/monthCount" });
    })
    .then((value) => {
      if (value.data.code == "200") {
        document.getElementById("MonthCount").innerText = toFarsiNumber(
          value.data.MonthCounted
        );
        document.getElementById("MonthCounted").innerText = toFarsiNumber(
          value.data.MonthCount - value.data.MonthCounted
        );
      }
      return axios({ method: "get", url: "/weekCount" });
    })
    .then((value) => {
      if (value.data.code == "200") {
        document.getElementById("WeekCount").innerText = toFarsiNumber(
          value.data.WeekCounted
        );
        document.getElementById("WeekCounted").innerText = toFarsiNumber(
          value.data.WeekCount - value.data.WeekCounted
        );
      }
      return axios({ method: "get", url: "/dayCount" });
    })
    .then((value) => {
      if (value.data.code == "200") {
        document.getElementById("DayCount").innerText = toFarsiNumber(
          value.data.DayCounted
        );
        document.getElementById("DayCounted").innerText = toFarsiNumber(
          value.data.DayCount - value.data.DayCounted
        );
      }
    });
}
function editProfilePage() {
  let loggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(loggedUser);
  document.title = "ویرایش پروفایل";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(7)"
  ).className += " dashboard_panel_item_active";
  document.getElementById("username").value = loggedUser.Username;
  document.getElementById("name").value = loggedUser.Name;
  document.getElementById("password").value = "";
  document.getElementById("_id").value = loggedUser._id;
  //
  document.getElementById("edit_profile_form_submit").onclick = () => {
    document.getElementById("edit_profile_form").submit();
  };
}
function editDeadPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  document.getElementById("popup_content_1_btn1").onclick = () => {
    if (
      (document.getElementById("fullName").value + "").split(" ").length == 1
    ) {
      alert("بین نام و نام خانوادگی فاصله دهید");
    } else {
      document.getElementById("deads_edit_form").submit();
    }
  };
  document.getElementById("popup_content_2_btn1").onclick = () => {
    if (
      (document.getElementById("fullName").value + "").split(" ").length == 1
    ) {
      alert("بین نام و نام خانوادگی فاصله دهید");
    } else {
      document.getElementById("dirType").value = "1";
      document.getElementById("deads_edit_form").submit();
    }
  };

  document.title = "ویرایش فوتی";
}
function addDeadPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  document.getElementById("popup_content_1_btn1").onclick = () => {
    if (
      (document.getElementById("fullName").value + "").split(" ").length == 1
    ) {
      alert("بین نام و نام خانوادگی فاصله دهید");
    } else {
      document.getElementById("deads_add_form").submit();
    }
  };
  document.getElementById("popup_content_2_btn1").onclick = () => {
    if (
      (document.getElementById("fullName").value + "").split(" ").length == 1
    ) {
      alert("بین نام و نام خانوادگی فاصله دهید");
    } else {
      document.getElementById("dirType").value = "1";
      document.getElementById("deads_add_form").submit();
    }
  };

  document.title = "افزودن فوتی";
}
function deadsPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_remove_button"),
    (element) => {
      element.onclick = () => {
        document.getElementById("user_remove_item_id").value = element.id;
        document.getElementById("user_remove_item_form").submit();
      };
    }
  );

  document.getElementById("pager").oninput = (el1) => {
    const el = el1.target;
    const number = el.value != "" ? Number(el.value) : "FALSE";
    if (number != "FALSE" && (number > el.max || number < el.min)) {
      if (number > el.max) el.value = el.max;
      else if (number < el.min) el.value = el.min;
    }
  };
  document.getElementById("pagerOnClick").onclick = (el) => {
    el.preventDefault();
    const number = document.getElementById("pager").value;
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("q"))
      window.location.search = "q=" + urlParams.get("q") + "&" + "id=" + number;
    else window.location.search = "id=" + number;
  };
  document.getElementById("lastPage").onclick = () => {
    const widget = document.getElementById("pager");
    const number = Number(widget.value);
    const min = Number(widget.min);
    const urlParams = new URLSearchParams(window.location.search);

    if (number - 1 >= min) {
      if (urlParams.get("q"))
        window.location.search =
          "q=" + urlParams.get("q") + "&" + "id=" + (number - 1);
      else window.location.search = "id=" + (number - 1);
    }
  };
  document.getElementById("nextPage").onclick = () => {
    const widget = document.getElementById("pager");
    const number = Number(widget.value);
    const max = Number(widget.max);
    const urlParams = new URLSearchParams(window.location.search);

    if (number + 1 <= max) {
      if (urlParams.get("q"))
        window.location.search =
          "q=" + urlParams.get("q") + "&" + "id=" + (number + 1);
      else window.location.search = "id=" + (number + 1);
    }
  };
  document.title = "فوتی ها";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(2)"
  ).className += " dashboard_panel_item_active";
}
function deadPage() {
  setLayoutProperties(
    JSON.parse(document.getElementById("LoggedOnUser").title)
  );
  document.title = "جزییات فوتی";
}
function settingsPage() {
  setLayoutProperties(
    JSON.parse(document.getElementById("LoggedOnUser").title)
  );
  document.title = "تنظیمات";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(10)"
  ).className += " dashboard_panel_item_active";
}
function statementsAddPage() {
  setLayoutProperties(
    JSON.parse(document.getElementById("LoggedOnUser").title)
  );
  document.title = "اعلامیه ها";
  document.getElementById("statement_add_submit").onclick = () => {
    const nI = document.getElementById("nI").value;
    axios({
      method: "post",
      url: "/statements/getInfo",
      data: {
        nI: nI,
      },
    }).then((value) => {
      if (value.data.code == "200") {
        document.getElementById(
          "deadData"
        ).textContent = `نام و نام خانوادگی متوفی:  \t${value.data.dead.FullName} \t\t\t\t نام پدر متوفی: \t${value.data.dead.FatherName}`;
        document.getElementById("statements_add_nI_hidden").value = nI;
        document.getElementById("statements_add_form_holder").style.display =
          "block";
      }
    });
  };
  document.getElementById("statements_add_pic").onchange = (e) => {
    if (e.target.files[0].size > 1097152) {
      alert("سایز تصویر اعلامیه بسیار بزرگ است");
      e.target.value = "";
    }
  };
  const m = new URLSearchParams(window.location.search).get("m");
  if (m) {
    if (m == "200") {
      alert("اپلود با موفقیت انجام شد");
    } else if (m == "500") {
      alert("مشکلی در آپلود به وجود آمد");
    }
  }
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(9)"
  ).className += " dashboard_panel_item_active";
}
function statesPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  let popup = document.getElementById("popup2");
  let popupContent = document.getElementById("popup_content_2");
  document.getElementById("add").onclick = (e) => {
    e.preventDefault();
    showPopup2(popup, popupContent);
  };
  let onPopupContent = false;
  popupContent.onmouseenter = () => {
    onPopupContent = true;
  };
  popupContent.onmouseleave = () => {
    onPopupContent = false;
  };
  popup.onclick = () => {
    if (!onPopupContent) hiddenPopup(popup, popupContent);
  };
  document.getElementById("popup_content_2_btn1").onclick = () => {
    document.getElementById("popup_content_2_form1").submit();
    hiddenPopup(popup, popupContent);
  };
  document.getElementById("popup_content_2_btn2").onclick = () => {
    hiddenPopup(popup, popupContent);
  };
  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_edit_button"),
    (element) => {
      element.onclick = (e) => {
        showPopup2(popup, popupContent, JSON.parse(element.id));
      };
    }
  );

  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_remove_button"),
    (element) => {
      element.onclick = (e) => {
        document.getElementById("user_remove_item_id").value = element.id;
        document.getElementById("user_remove_item_form").submit();
      };
    }
  );

  document.title = "قطعه ها";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(3)"
  ).className += " dashboard_panel_item_active";
}
function deadtypesPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  let popup = document.getElementById("popup3");
  let popupContent = document.getElementById("popup_content_3");
  document.getElementById("add").onclick = (e) => {
    e.preventDefault();
    showPopup3(popup, popupContent);
  };
  let onPopupContent = false;
  popupContent.onmouseenter = () => {
    onPopupContent = true;
  };
  popupContent.onmouseleave = () => {
    onPopupContent = false;
  };
  popup.onclick = () => {
    if (!onPopupContent) hiddenPopup(popup, popupContent);
  };
  document.getElementById("popup_content_3_btn1").onclick = () => {
    document.getElementById("popup_content_3_form1").submit();
    hiddenPopup(popup, popupContent);
  };
  document.getElementById("popup_content_3_btn2").onclick = () => {
    hiddenPopup(popup, popupContent);
  };
  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_edit_button"),
    (element) => {
      element.onclick = (e) => {
        showPopup3(popup, popupContent, JSON.parse(element.id));
      };
    }
  );

  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_remove_button"),
    (element) => {
      element.onclick = (e) => {
        document.getElementById("user_remove_item_id").value = element.id;
        document.getElementById("user_remove_item_form").submit();
      };
    }
  );

  document.title = "انواع فوتی ها";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(4)"
  ).className += " dashboard_panel_item_active";
}
function costsPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  let popup = document.getElementById("popup4");
  let popupContent = document.getElementById("popup_content_4");
  document.getElementById("add").onclick = (e) => {
    e.preventDefault();
    showPopup4(popup, popupContent);
    let el = document.getElementById("price");
    el.value = PersianPriceSpacer(el.value, 3);
  };
  let onPopupContent = false;
  popupContent.onmouseenter = () => {
    onPopupContent = true;
  };
  popupContent.onmouseleave = () => {
    onPopupContent = false;
  };
  popup.onclick = () => {
    if (!onPopupContent) hiddenPopup(popup, popupContent);
  };
  document.getElementById("popup_content_4_btn1").onclick = () => {
    let el = document.getElementById("price");
    el.value = el.value.replace(/,/g, "");
    document.getElementById("popup_content_4_form1").submit();
    hiddenPopup(popup, popupContent);
  };
  document.getElementById("popup_content_4_btn2").onclick = () => {
    hiddenPopup(popup, popupContent);
  };
  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_edit_button"),
    (element) => {
      element.onclick = (e) => {
        showPopup4(popup, popupContent, JSON.parse(element.id));
        let el = document.getElementById("price");
        el.value = PersianPriceSpacer(el.value, 3);
      };
    }
  );

  Array.prototype.forEach.call(
    document.getElementsByClassName("users_table_item_remove_button"),
    (element) => {
      element.onclick = (e) => {
        document.getElementById("user_remove_item_id").value = element.id;
        document.getElementById("user_remove_item_form").submit();
      };
    }
  );

  document.title = "هزینه ها";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(5)"
  ).className += " dashboard_panel_item_active";
}
function additionalPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  //
  let totalCost = document.getElementById("totalPrice");
  let price = 0;
  document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
    if (el.checked) price += Number(el.getAttribute("price"));
    el.onchange = () => {
      price = 0;
      document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
        if (el.checked) price += Number(el.getAttribute("price"));
      });
      totalCost.innerText = PersianPriceSpacer(toFarsiNumber(price), 3);
    };
  });
  totalCost.innerText = price;
  document.getElementById("popup_content_1_btn1").onclick = () => {
    document.getElementById("deads_add_form").submit();
  };
  document.title = "افزودن اطلاعات تکمیلی فوتی";
}
function reports_previewPage() {
  Array.prototype.forEach.call(
    document.getElementsByClassName("toPersian"),
    (el) => (el.innerText = toFarsiNumber(el.innerText))
  );
  Array.prototype.forEach.call(
    document.getElementsByClassName("toPrice"),
    (el) => (el.innerText = PersianPriceSpacer(el.innerText, 3))
  );
  document.title = "گزارش گیری";
}
function reportsPage() {
  let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  setLayoutProperties(LoggedUser);
  document.querySelector("#ChooseSelect > li:first-child").className = "select";
  let items = document.querySelectorAll("#ChooseSelect > li");
  let selected = document.querySelector("#ChooseSelect > li.select");
  items.forEach((el) => {
    el.onclick = (i) => {
      el.className = "select";
      selected.className = "";
      selected = el;
      document.getElementById("ChooseSelectInput").value = selected.title;
    };
  });

  document.title = "گزارش گیری";
  document.querySelector(
    "#dashboard_items_parent > div:nth-child(8)"
  ).className += " dashboard_panel_item_active";
}
function deathReportPage() {
  // let LoggedUser = JSON.parse(document.getElementById("LoggedOnUser").title);
  // setLayoutProperties(LoggedUser);
  Array.prototype.forEach.call(
    document.getElementsByClassName("toPersian"),
    (el) => (el.innerText = toFarsiNumber(el.innerText))
  );
  document.title = "گزارش فوت";
}
function setLayoutProperties(obj) {
  document.getElementById("header_login_button").innerText = obj.Name;
  document.getElementById("body_dashboard_panel_little_name").innerText = (
    obj.Name + ""
  ).split(" ")[0];
  document.getElementById("body_dashboard_panel_roleId").innerText =
    obj.RoleId == 1
      ? "دسترسی : مدیر کل"
      : obj.RoleId == 2
      ? "دسترسی : پشتیبانی"
      : obj.RoleId == 3
      ? "دسترسی :چاپخانه"
      : "دسترسی : ثبت احوال ";
}
function hiddenPopup(popup, popupContent) {
  popup.style.visibility = "hidden";
  popup.style.opacity = "0";
  popupContent.style.visibility = "hidden";
  popupContent.style.opacity = "0";
}
function showPopup(popup, popupContent, obj) {
  popup.style.visibility = "visible";
  popup.style.opacity = "1";
  popupContent.style.visibility = "visible";
  popupContent.style.opacity = "1";
  if (obj) {
    document.getElementById("username").value = obj.Username;
    document.getElementById("password").value = "";
    document.getElementById("name").value = obj.Name;
    document.getElementById("roleId").value = obj.RoleId;
    document.getElementById("popup_content_1_HID").value = obj._id;
    document.getElementById("popup_content_1_title1").innerText =
      "ویرایش کاربر";
    document.getElementById("popup_content_1_form1").action = "/users/edit";
  } else {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("name").value = "";
    document.getElementById("roleId").value = 1;
    document.getElementById("popup_content_1_title1").innerText =
      "اضافه کردن کاربر";
    document.getElementById("popup_content_1_form1").action = "/users/add";
  }
}
function showPopup2(popup, popupContent, obj) {
  popup.style.visibility = "visible";
  popup.style.opacity = "1";
  popupContent.style.visibility = "visible";
  popupContent.style.opacity = "1";
  if (obj) {
    document.getElementById("name2").value = obj.Name;
    document.getElementById("rows").value = obj.Rows;
    document.getElementById("count").value = obj.Count;
    document.getElementById("popup_content_2_HID").value = obj._id;
    document.getElementById("popup_content_2_title1").innerText = "ویرایش قطعه";
    document.getElementById("popup_content_2_form1").action = "/states/edit";
  } else {
    document.getElementById("name2").value = "";
    document.getElementById("rows").value = "";
    document.getElementById("count").value = "";
    document.getElementById("popup_content_2_title1").innerText =
      "اضافه کردن قطعه";
    document.getElementById("popup_content_2_form1").action = "/states/add";
  }
}
function showPopup3(popup, popupContent, obj) {
  popup.style.visibility = "visible";
  popup.style.opacity = "1";
  popupContent.style.visibility = "visible";
  popupContent.style.opacity = "1";
  if (obj) {
    document.getElementById("name3").value = obj.Name;
    document.getElementById("popup_content_3_HID").value = obj._id;
    document.getElementById("popup_content_3_title1").innerText =
      "ویرایش نوع فوتی";
    document.getElementById("popup_content_3_form1").action = "/deadtypes/edit";
  } else {
    document.getElementById("name3").value = "";
    document.getElementById("popup_content_3_title1").innerText =
      "اضافه کردن نوع فوتی";
    document.getElementById("popup_content_3_form1").action = "/deadtypes/add";
  }
}
function showPopup4(popup, popupContent, obj) {
  popup.style.visibility = "visible";
  popup.style.opacity = "1";
  popupContent.style.visibility = "visible";
  popupContent.style.opacity = "1";
  if (obj) {
    document.getElementById("name4").value = obj.Name;
    document.getElementById("price").value = obj.Price;
    document.getElementById("popup_content_4_HID").value = obj._id;
    document.getElementById("popup_content_4_title1").innerText =
      "ویرایش هزینه";
    document.getElementById("popup_content_4_form1").action = "/costs/edit";
  } else {
    document.getElementById("name4").value = "";
    document.getElementById("price").value = "";
    document.getElementById("popup_content_4_title1").innerText =
      "اضافه کردن هزینه";
    document.getElementById("popup_content_4_form1").action = "/costs/add";
  }
}
function toFarsiNumber(n) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
}
//Addon Functions
//Link: https://github.com/Canoir/JavaScriptPersianPriceSpacer
function PersianPriceSpacer(price, length) {
  let result = "";
  let el;
  price = price.replace(/,/g, "");
  if (typeof price == "number") price = String(price);
  for (let count = 1; count <= price.length; count++) {
    el = price.charAt(price.length - count);
    result = el + result;
    if (count % length == 0) result = "," + result;
  }
  return result[0] == "," ? result.substring(1) : result;
}
