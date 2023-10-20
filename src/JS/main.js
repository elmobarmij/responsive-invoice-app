"use strict";

/*   Variables   */

const monthsArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Toggle Dark Mode
document.getElementById("btnSwitch").addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
    document.documentElement.setAttribute("data-bs-theme", "light");
    document
      .querySelector(".mode")
      .setAttribute("src", "../src/images/icon-moon.svg");
  } else {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    document
      .querySelector(".mode")
      .setAttribute("src", "../src/images/icon-sun.svg");
  }
});

// Outer Page
const renderOuterPage = async function () {
  /*    Helper Functions   */

  const emptyInputs = function () {
    allInputs.forEach((input) => (input.value = ""));
  };

  const overlayControl = function () {
    newInvoice.classList.remove("active");
    invoicesContainer.style.zIndex = "1";
    document.body.style.overflowY = "initial";
  };

  const deleteItems = function (el) {
    el.forEach((del) => {
      del.addEventListener("click", function (e) {
        e.currentTarget.closest(".invoice__item").remove();
      });
    });
  };
  deleteItems(document.querySelectorAll(".delete-item"));

  const createNewItem = function (el) {
    const itemMarkup = `
  <div class="invoice__item w-100 mb-5">
  <div class="mb-4">
    <label class="label-street label-f-size label-control"
      >Item Name
    </label>
    <input
      required
      class="form-control p-5 fw-bold fs-3"
      type="text"
      value="New Item"
    />
  </div>

  <div class="d-flex gap-4 mb-4 align-items-center">
    <div class="w-25">
      <label
        class="label-street d-block label-f-size label-control"
      >
        Qty.</label
      >
      <input
        required
        class="input-quantity form-control p-5 fw-bold"
        type="text"
        value="1"
      />
    </div>

    <div class="w-25">
      <label class="label-street label-f-size label-control"
        >Price</label
      >
      <input
        required
        class="input-price form-control p-5 fw-bold"
        type="text"
        value="0"
      />
    </div>

    <div class="item-info d-flex w-50 justify-content-around">
      <div class="item-total label-street">Total</div>
      <span class="price-total fw-bold">0.00</span>
      <img
        class="delete-item item-img"
        src="../src/images/icon-delete.svg"
        style="height: 22px"
        alt="delete"
      />
    </div>
  </div>
</div>
`;

    el.insertAdjacentHTML("beforeend", itemMarkup);

    calcItemPrice(document.querySelectorAll(".input-price"));
    calcItemPrice(document.querySelectorAll(".input-quantity"));
    deleteItems(document.querySelectorAll(".delete-item"));
  };

  const calcItemPrice = function (element) {
    element.forEach((inp) => {
      inp.addEventListener("input", function () {
        const totalPriceEl =
          inp.closest(".invoice__item").childNodes[3].lastElementChild
            .lastElementChild.previousElementSibling;
        const itemQuantity =
          inp.closest(".invoice__item").children[1].firstElementChild
            .lastElementChild.value;
        let itemPrice =
          inp.closest(".invoice__item").children[1].firstElementChild
            .nextElementSibling.lastElementChild.value;
        const totalPrice = itemQuantity * itemPrice;
        totalPriceEl.textContent = totalPrice.toFixed(2);
      });
    });
  };
  calcItemPrice(document.querySelectorAll(".input-price"));
  calcItemPrice(document.querySelectorAll(".input-quantity"));

  const calcDue = function () {
    const arr = Array.from(inputTerms);
    const [chosenDue] = arr.filter((inp) => inp.selected);
    const days = +chosenDue.getAttribute("value");
    return days;
  };

  const formattedDate = function (date) {
    const str = date;
    const day = +str.slice(-2);
    const year = str.slice(0, 4);
    const month = monthsArray[str.slice(5, 7) - 1].substring(0, 3);
    const chosenDate = `${day < 10 ? `0${day}` : day} ${month} ${year}`;
    return chosenDate;
  };

  const calcFinalPrice = function (elements) {
    const itemsPriceArray = Array.from(elements);
    let arrayOfNums = [];
    itemsPriceArray.map((el) => arrayOfNums.push(+el.textContent));
    const finalPrice = arrayOfNums.reduce((ac, cur) => ac + cur, 0);
    return Number.isInteger(finalPrice)
      ? `${finalPrice}.00`
      : `${finalPrice.toFixed(2)}`;
  };

  const generateId = function () {
    const randomId = Math.floor(Math.random() * 16777215)
      .toString(16)
      .toUpperCase();
    return randomId;
  };

  const calcdueDate = function () {
    const dueDate = new Date(calendarInput.value);
    const paymentDue = new Date(dueDate.setDate(dueDate.getDate() + calcDue()));
    const dueDay = paymentDue.getDate();
    const dueMonth = paymentDue.getMonth() + 1;
    const dueYear = paymentDue.getFullYear();
    const finalDueDate = `${dueYear}-${
      dueMonth < 10 ? `0${dueMonth}` : dueMonth
    }-${dueDay < 10 ? `0${dueDay}` : dueDay}`;
    return finalDueDate;
  };

  const createNewInvoice = function (invoiceColor, invoiceStatus) {
    const markup = `
  <section
  class="invoice position-relative col-lg-10 offset-lg-1 bg-white p-5 mb-4"
 >
  <div class="row">
    <div
      class="invoice-box d-md-flex justify-content-between align-items-center"
    >
      <span
        class="owner-info mb-5 mb-md-0 d-flex flex-column flex-md-row 
        justify-content-between align-items-md-center"
      >
        <span class="invoice-id fw-bold"
          ><span class="hash">#</span>${generateId()}</span
        >
        <span class="invoice-date d-block d-md-inline-block"
          >Due ${formattedDate(calcdueDate())}</span
        >
      </span>
      <span class="invoice-owner">${clientInput.value}</span>
      <div class="d-flex align-items-center">
        <div class="d-md-flex flex-column flex-md-row">
          <span class="invoice-price fw-medium">$${calcFinalPrice(
            document.querySelectorAll(".price-total")
          )}</span>
        </div>
        <span
          class="invoice-status-container d-flex align-items-center ms-auto ms-md-0"
        >
          <div
            class="invoice-status mr-0 mr-md-5 ${invoiceColor}-invoice d-flex 
            justify-content-center align-items-center"
          >
            <img src="../src/images/${invoiceColor}-dot.svg" alt="" />
            ${invoiceStatus}
          </div>
          <img
            class="arrow d-none d-md-inline-block"
            src="../src/images/icon-arrow-right.svg"
            alt="arrow right"
        /></span>
      </div>
    </div>
  </div>
 </section>
  `;

    invoicesContainer.insertAdjacentHTML("beforeend", markup);
  };

  // Request data
  const req = await fetch("http://localhost:3000/data");
  const data = await req.json();
  data.forEach((data) => {
    const invoiceColor = function () {
      return data.status === "paid"
        ? "green"
        : data.status === "pending"
        ? "orange"
        : "grey";
    };
    const formattedPrice = function (price) {
      return Number.isInteger(price) ? `${price}.00` : `${price.toFixed(2)}`;
    };

    const invoiceMarkup = `
    <section
    class="invoice ${
      data.status
    } position-relative col-lg-10 offset-lg-1 bg-white p-5 mb-4"
     >
    <div class="row">
      <div
        class="invoice-box d-md-flex justify-content-between align-items-center"
      >
        <span
          class="owner-info mb-5 mb-md-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center"
        >
          <span class="invoice-id fw-bold"
            ><span class="hash">#</span>${data.id}</span
          >
          <span class="invoice-date d-block d-md-inline-block"
            >Due ${formattedDate(data.createdAt)}</span
          >
        </span>
        <span class="invoice-owner">${data.clientName}</span>
        <div class="d-flex align-items-center">
          <div class="d-md-flex flex-column flex-md-row">
            <span class="invoice-price fw-medium">$${formattedPrice(
              data.total
            )}</span>
          </div>
          <span
            class="invoice-status-container d-flex align-items-center ms-auto ms-md-0"
          >
            <div
              class="invoice-status mr-0 mr-md-5 ${invoiceColor()}-invoice d-flex justify-content-center align-items-center"
            >
              <img src="../src/images/${invoiceColor()}-dot.svg" alt="" />
              ${data.status}
            </div>
            <img
              class="arrow d-none d-md-inline-block"
              src="../src/images/icon-arrow-right.svg"
              alt="arrow right"
          /></span>
         </div>
       </div>
      </div>
     </section>
    `;

    const invoiceContainer = document.querySelector(".invoices-container");
    invoiceContainer.insertAdjacentHTML("beforeend", invoiceMarkup);
  });

  const mainSection = document.querySelector(".main");
  const newInvoice = document.querySelector(".new-invoice");
  const invoicesContainer = document.querySelector(".invoices-container");
  const invoices = document.querySelectorAll(".invoice");
  const createInvoice = document.querySelector(".create-invoice");
  const addItems = document.querySelector(".add--new-item");
  const backBtn = document.querySelector(".back-btn");
  const btnDiscard = document.querySelector(".btn__discard");
  const btnSave = document.querySelector(".btn__save");
  const btnDraft = document.querySelector(".btn__draft");
  const colTwo = document.querySelector(".invoice-second-col");
  const filterBtn = document.querySelector(".filter");
  const errorMessage = document.querySelectorAll("form .input-validation");
  const calendarInput = document.querySelector("form .calendar");
  const clientInput = document.querySelector("form .client-name");
  const inputTerms = document.querySelectorAll(".dropdown option");
  const allInputs = document.querySelectorAll(
    ".new-invoice form input:not(.calendar)"
  );

  // Render Data from json
  const renderAllInvoicesData = function () {
    const invoices = document.querySelectorAll(".invoice");
    invoices.forEach((inv) => {
      inv.addEventListener("click", function () {
        renderJSONInfo(inv);
      });
    });

    const renderJSONInfo = function (inv) {
      const targetInvoiceId =
        inv.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent
          .slice(1)
          .trim();

      const getData = async function () {
        const response = await fetch("http://localhost:3000/data");
        const dataArray = await response.json();
        const filterData = dataArray.filter((d) => d.id === targetInvoiceId);
        const [data] = filterData;
        if (data === undefined) {
          mainSection.classList.add("hidden");
          return;
        }
        showInnerPage(data);
      };
      getData();
    };
  };
  renderAllInvoicesData();

  /*   Inner Page Script   */

  const showInnerPage = function (data) {
    mainSection.classList.add("hidden");
    createInnerPageMarkup(data);
  };

  // Inner Page
  const createInnerPageMarkup = function (data) {
    const senderAddress = data.senderAddress;
    const clientAddress = data.clientAddress;
    const item = data.items;

    const invoiceColor = function () {
      return data.status === "paid"
        ? "green"
        : data.status === "pending"
        ? "orange"
        : "grey";
    };

    const findInvoiceId = function () {
      const elements = Array.from(document.querySelectorAll(".invoice-id"));
      const [el] = elements.filter(
        (el) => el.textContent.trim() === `#${data.id}`
      );
      const targetInvoice = el.closest(".invoice");
      return targetInvoice;
    };

    const formattedPrice = function (price) {
      return Number.isInteger(price) ? `${price}.00` : `${price.toFixed(2)}`;
    };

    const markup = `
   <section class="new-invoice new-invoice__inner d-block d-md-grid">
    <div class="row d-flex">
    <div class="invoice-first-col bg-white w-100 col-6-md px-5 py-4">
      <a
        href=""
        class="back-btn back-btn__mobile d-flex align-items-center gap-3 mt-3 mb-5 py-3 pl-4 d-block d-md-none"
        ><img
          class="mr-2"
          src="../src/images/icon-arrow-left.svg"
          alt="arrow"
        />
        Go back</a
      >
      <div class="invoice-title-new mb-5">Edit #${data.id}</div>
      <h3 class="bill-title mb-5">Bill From</h3>
      <!-- Form -->
      <form class="form-create">
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-street label-f-size label-control"
              >Street Address</label
            >
            <div class="input-validation">can't be empty</div>
          </div>
          <input
          value="${senderAddress.street}"
            required
            class="sender-street form-control p-5"
            type="text"
          />
        </div>

        <div
          class="d-flex justify-content-between align-items-center gap-3 mb-4"
        >
          <div class="w-50">
            <div
              class="d-flex justify-content-between align-items-center"
            >
              <label class="label-street label-f-size label-control"
                >Country</label
              >
              <div class="input-validation">can't be empty</div>
            </div>
            <input
            value="${senderAddress.country}"
              required
              class="sender-country form-control p-5"
              type="text"
            />
          </div>

          <div class="w-50">
            <div
              class="d-flex justify-content-between align-items-center"
            >
              <label class="label-street label-f-size label-control"
                >City</label
              >
              <div class="input-validation">can't be empty</div>
            </div>
            <input
            value="${senderAddress.city}"
              required
              class="sender-city form-control p-5"
              type="text"
            />
          </div>
        </div>

        <div class="mb-5">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-street label-f-size label-control"
              >Post Code</label
            >
            <div class="input-validation">can't be empty</div>
          </div>
          <input
          value="${senderAddress.postCode}"
          required
          class="sender-post form-control p-5"
          type="text"
          />
          </div>
          
        <!-- Bill to -->
        <h3 class="bill-title mb-5">Bill To</h3>
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
          <label class="label-street label-f-size label-control"
              >Client's Name</label
              >
            <div class="input-validation">can't be empty</div>
          </div>
          <input
          value="${data.clientName}"
          required
          class="client-name client-name form-control p-5"
          type="text"
          />
          </div>
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-street label-f-size label-control"
              >Client's Email</label
            >
            <div class="input-validation">can't be empty</div>
          </div>
          <input
          value="${data.clientEmail}"
          required
          class="client-email form-control p-5"
          type="email"
            placeholder="e.g. email@example.com"
            />
        </div>
        <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center">
            <label class="label-street label-f-size label-control"
            >Street Address</label
            >
            <div class="input-validation">can't be empty</div>
          </div>
          <input
          value="${clientAddress.street}"
            required
            class="client-street form-control p-5"
            type="text"
          />
        </div>

        <div
          class="d-flex justify-content-between align-items-center gap-3 mb-4"
        >
          <div class="w-50">
            <div
              class="d-flex justify-content-between align-items-center"
            >
              <label class="label-street label-f-size label-control"
                >Country</label
              >
              <div class="input-validation">can't be empty</div>
            </div>
            <input
            value="${clientAddress.country}"
              required
              class="client-country form-control p-5"
              type="text"
            />
          </div>

          <div class="w-50">
            <div
              class="d-flex justify-content-between align-items-center"
            >
              <label class="label-street label-f-size label-control"
                >City</label
              >
              <div class="input-validation">can't be empty</div>
            </div>
            <input
            value="${clientAddress.city}"
            required
              class="client-city form-control p-5"
              type="text"
            />
          </div>
        </div>

        <div class="mb-5">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-street label-f-size label-control"
              >Post Code</label
            >
            <div class="input-validation">can't be empty</div>
          </div>
          <input
          value="${clientAddress.postCode}"
          required
          class="client-post form-control p-5"
          type="text"
          />
        </div>

        <div class="mb-5">
          <label class="label-street label-f-size label-control"
            >Invoice Date</label
          >
          <input
          value="${data.createdAt}"
          disabled
          class="calendar form-control p-5"
          type="date"
          value="2023-10-02"
          />
        </div>

        <div class="mb-5">
        <label class="label-street label-f-size label-control"
        >Payment Terms</label
          >
          <select
          value="${data.paymentTerms}"
          readonly
          class="dropdown form-control p-4 h-100 w-100 label-street label-f-size"
          name="select"
          >
            <option value="1">Net 1 day</option>
            <option value="7">Net 7 days</option>
            <option value="14">Net 14 days</option>
            <option value="30">Net 30 days</option>
          </select>
        </div>

        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-street label-f-size label-control"
              >Project Descripton</label
            >
            <div class="input-validation">can't be empty</div>
            </div>
            <input
            value="${data.description}"
            required
            class="description form-control p-5"
            type="text"
            placeholder=" e.g. Graphic Design Service"
          />
        </div>
      </form>

      <div class="invoice__item-list">
        <h3 class="mb-5">Item List</h3>

        <div class="items-container"></div>

        <div class="add--new-item fw-bold text-center p-4 rounded-5">
          <img src="../src/images/icon-plus.svg" alt="plus" />
          Add New Item
        </div>
      </div>

      <div
        class="action-btns d-flex justify-content-end flex-wrap-wrap gap-3 py-5"
      >
        <button class="btn action-btn btn__discard rounded-pill">
        Cancel
        </button>
        <button class="btn action-btn btn__save rounded-pill">
         Save Changes
         </button>
        </div>
      </div>
    </div>
    <div class="col-6-md invoice-second-col w-100"></div>
   </section>
  
   <section
    class="invoice-inner-container container-fluid container-md col-11 pt-5"
   >
    <button
      class="back-btn go-back-inner d-flex align-items-center col-lg-10 offset-lg-1 
      gap-3 mb-5 py-3 pl-4"
      ><img
        class="mr-2"
        src="../src/images/icon-arrow-left.svg"
        alt="arrow"
      />
      Go back</button
    >

    <section
      class="invoice-inner position-relative col-lg-10 offset-lg-1 bg-white p-5 mb-4"
    >
      <div class="row">
        <div
          class="invoice-box d-flex justify-content-between align-items-center"
        >
          <span
            class="owner-info d-flex flex-column flex-md-row justify-content-between 
            align-items-md-center"
          >
            <div class="d-flex align-items-center">
              <div class="d-md-flex flex-column flex-md-row">
                <span class="invoice-owner">status</span>
              </div>
              <span
                class="invoice-status-container d-flex align-items-center ms-auto ms-md-0"
              >
                <div
                  class="invoice-status mr-0 mr-md-5 ${invoiceColor()}-invoice d-flex 
                  justify-content-center align-items-center"
                >
                  <img src="../src/images/${invoiceColor()}-dot.svg" alt="" />
                  ${data.status}
                </div>
              </span>
            </div>
          </span>

          <div
            class="action-btns action-btns__inner d-flex justify-content-end flex-wrap-wrap gap-3"
          >
            <button class="btn action-btn btn__discard rounded-pill">
              Edit
            </button>
            <button class="btn action-btn btn__delete-inner rounded-pill">
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>

    <main
      class="container-fluid container-md inner-info-container bg-white col-lg-10 offset-lg-1"
    >
      <div
        class="d-flex flex-column flex-md-row justify-content-between mb-5"
      >
        <div class="mb-5 mb-md-0">
          <p class="fw-bold">#${data.id}</p>
          <p class="title">${data.description}</p>
        </div>
        <div>
          <p class="title">${senderAddress.street}</p>
          <p class="title">${senderAddress.city}</p>
          <p class="title">${senderAddress.postCode}</p>
          <p class="title">${senderAddress.country}</p>
        </div>
      </div>

      <div class="inner-info-personal d-grid">
        <div>
          <p class="title mb-4">Invoice Date</p>
          <p class="fw-medium big special">${formattedDate(data.createdAt)}</p>
          <p class="title mb-4">Payment Due</p>
          <p class="fw-medium big">${formattedDate(data.paymentDue)}</p>
        </div>
        <div>
          <p class="title mb-4">Bill To</p>
          <p class="fw-medium big mb-4">${data.clientName}</p>
          <p class="title">${clientAddress.street}</p>
          <p class="title">${clientAddress.city}</p>
          <p class="title">${clientAddress.postCode}</p>
          <p class="title">${clientAddress.country}</p>
        </div>
        <div>
          <p class="title mb-4">Sent To</p>
          <p class="fw-medium big">${data.clientEmail}</p>
        </div>
      </div>

      <div class="inner-info-item">
        <div class="info-div w-100 d-table d-md-grid row-gap-2 row-gap-md-5 text-left text-md-right"">
          <span class="text-left d-none d-md-block">Item Name</span>
          <span class="d-none d-md-block">QTY.</span>
          <span class="d-none d-md-block">Price</span>
          <span class="d-none d-md-block">Total</span>
        </div>
      </div>
      <div
        class="inner-summary d-flex align-items-center justify-content-between"
      >
        <span>Amount Due</span>
        <h2>$${formattedPrice(data.total)}</h2>
      </div>
    </main>
   </section>
   `;

    document.body.insertAdjacentHTML("beforeend", markup);

    // delete modal
    const deleteInnerBtn = document.querySelector(".btn__delete-inner");
    deleteInnerBtn.addEventListener("click", function () {
      const modal = `
            <div class="inner-overlay"></div>
            <div class="delete-modal d-flex flex-column gap-3">
              <h2>Confirm Deletion</h2>
              <p>
                Are you sure you want to delete invoice #${data.id} This action
                cannot be undone.
              </p>
              <div
                class="action-btns action-btns__inner d-flex justify-content-end flex-wrap-wrap gap-3"
              >
                <button class="btn action-btn btn__discard rounded-pill">
                  Cancel
                </button>
                <button class="btn action-btn btn__delete-inner btn__delete-secondary rounded-pill">
                  Delete
                </button>
            </div>
            </div>
            `;
      document.body.insertAdjacentHTML("beforeend", modal);

      const cancelBtn = document.querySelector(".delete-modal .btn__discard");
      const innerOverlay = document.querySelector(".inner-overlay");
      const deleteModal = document.querySelector(".delete-modal");
      const btnDelete = document.querySelector(".btn__delete-secondary");

      const hideOverlay = function () {
        innerOverlay.remove();
        deleteModal.remove();
      };

      const removeInvoice = async function () {
        const deleteJSON = async function () {
          let headersList = {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
          };
          await fetch(`http://localhost:3000/data/${data.id}`, {
            method: "DELETE",
            headers: headersList,
          });
        };

        findInvoiceId().remove();
        deleteJSON();
        hideOverlay();
        hideInnerPage();
      };

      cancelBtn.addEventListener("click", hideOverlay);
      innerOverlay.addEventListener("click", hideOverlay);
      btnDelete.addEventListener("click", function () {
        removeInvoice();
        removeInnerSidebar();
      });
    });
    // end modal

    if (data.status === "pending") {
      const mark = `
      <button class="btn action-btn btn__mark rounded-pill">
      Mark as Paid
      </button>
      `;
      document
        .querySelector(".action-btns__inner")
        .insertAdjacentHTML("beforeend", mark);
    }

    const selectCurrentTerm = function () {
      const options = document.querySelectorAll(
        ".new-invoice__inner .dropdown option"
      );
      let [target] = Array.from(options).filter(
        (op) => +op.getAttribute("value") === data.paymentTerms
      );

      target.selected = true;
    };
    selectCurrentTerm();

    // Handle Back from Inner Page
    const backBtnInner = document.querySelector(".go-back-inner");
    const innerPage = document.querySelector(".invoice-inner-container");
    const btnEdit = document.querySelector(".action-btns__inner .btn__discard");

    const hideInnerPage = function () {
      mainSection.classList.remove("hidden");
      innerPage.remove();
    };

    const removeInnerSidebar = function () {
      const newInvoiceInner = document.querySelector(".new-invoice__inner");
      newInvoiceInner.remove();
    };

    backBtnInner.addEventListener("click", function () {
      hideInnerPage();
      removeInnerSidebar();
    });

    const newInvoiceInner = document.querySelector(".new-invoice__inner");

    const hideOverlay = function () {
      newInvoiceInner.classList.remove("active");
      innerPage.style.zIndex = "1";
      document.body.style.overflowY = "initial";
    };

    // Deal with invoice items
    const createItems = function () {
      const items = data.items;
      items.forEach((it) => {
        const html = `
          <span class="item-title fw-bold d-block text-left">${it.name} </span>
            <span class="d-inline-flex justify-content-end d-md-flex d-md-block count"
              >${
                it.quantity
              } <span class="d-block mx-1 d-md-none"> x</span></span
            >
            <span class="d-inline-flex justify-content-end d-md-flex fw-medium title price">$${formattedPrice(
              it.price
            )}</span>
            <span class="d-flex justify-content-end fw-medium total">$${formattedPrice(
              it.total
            )}</span>
          `;
        const div = document.querySelector(".inner-info-item .info-div");
        div.insertAdjacentHTML("beforeend", html);
      });
    };
    createItems();

    const createItem = document.querySelector(
      ".new-invoice__inner .add--new-item"
    );

    const addItemsInner = document.querySelector(
      ".new-invoice__inner .items-container"
    );

    createItem.addEventListener("click", function () {
      createNewItem(addItemsInner);
      deleteItems(
        document.querySelectorAll(".new-invoice__inner .delete-item")
      );
    });

    const renderItemsInSidebar = function () {
      item.forEach((it) => {
        const itemMarkup = `
          <!-- ITEM -->
            <div class="invoice__item w-100 mb-5">
              <div class="mb-4">
                <label class="label-street label-f-size label-control"
                  >Item Name
                </label>
                <input
                  required
                  class="input--item-name form-control p-5 fw-bold fs-4"
                  type="text"
                  value="${it.name}"
                />
              </div>
        
              <div class="d-flex gap-4 mb-4 align-items-center">
                <div class="w-25">
                  <label
                    class="label-street d-block label-f-size label-control"
                  >
                    Qty.</label
                  >
                  <input
                    required
                    class="input-quantity form-control p-5 fw-bold"
                    type="number"
                    value="${it.quantity}"
                  />
                </div>
        
                <div class="w-25">
                  <label class="label-street label-f-size label-control"
                    >Price</label
                  >
                  <input
                    required
                    class="input-price form-control p-5 fw-bold"
                    type="number"
                    value="${it.price}"
                  />
                </div>
        
                <div class="item-info d-flex w-50 justify-content-around">
                  <div class="item-total label-street">Total</div>
                  <span class="price-total fw-bold">${it.total}</span>
                  <img
                    class="delete-item item-img"
                    src="../src/images/icon-delete.svg"
                    style="height: 22px"
                    alt="delete"
                  />
                </div>
              </div>
            </div>
          `;

        const itemsContainer = document.querySelector(
          ".new-invoice__inner .items-container"
        );
        itemsContainer.insertAdjacentHTML("beforeend", itemMarkup);
      });

      deleteItems(
        document.querySelectorAll(".new-invoice__inner .delete-item")
      );
    };
    renderItemsInSidebar();
    //

    const saveChangesBtn = document.querySelector(
      ".new-invoice__inner .btn__save"
    );

    const editInvoice = function () {
      innerPage.style.zIndex = "-1";
      newInvoiceInner.classList.add("active");
      document.body.style.overflowY = "hidden";

      const backBtnMobile = document.querySelector(".back-btn__mobile");

      const colTwoInner = document.querySelector(
        ".new-invoice__inner .invoice-second-col"
      );
      const cancelBtn = document.querySelector(
        ".new-invoice__inner .btn__discard"
      );

      colTwoInner.addEventListener("click", hideOverlay);
      cancelBtn.addEventListener("click", hideOverlay);
      backBtnMobile.addEventListener("click", hideOverlay);
      calcItemPrice(document.querySelectorAll(".input-price"));
      calcItemPrice(document.querySelectorAll(".input-quantity"));

      /*  handle Data Change  */

      const handleDataChange = function () {
        const defineCurrentTerm = function () {
          const options = document.querySelectorAll(
            ".new-invoice__inner .dropdown option"
          );
          let [target] = Array.from(options).filter((op) => op.selected);
          const currentTerm = +target.getAttribute("value");
          return currentTerm;
        };
        defineCurrentTerm();

        const senderStreet = document.querySelector(
          ".new-invoice__inner .sender-street"
        ).value;
        const senderCity = document.querySelector(
          ".new-invoice__inner .sender-city"
        ).value;
        const senderCountry = document.querySelector(
          ".new-invoice__inner .sender-country"
        ).value;
        const senderPost = document.querySelector(
          ".new-invoice__inner .sender-post"
        ).value;
        const inputDescription = document.querySelector(
          ".new-invoice__inner .description"
        ).value;
        const clientName = document.querySelector(
          ".new-invoice__inner .client-name"
        ).value;
        const clientEmail = document.querySelector(
          ".new-invoice__inner .client-email"
        ).value;
        const clientStreet = document.querySelector(
          ".new-invoice__inner .client-street"
        ).value;
        const clientCountry = document.querySelector(
          ".new-invoice__inner .client-country"
        ).value;
        const clientCity = document.querySelector(
          ".new-invoice__inner .client-city"
        ).value;
        const clientPost = document.querySelector(
          ".new-invoice__inner .client-post"
        ).value;
        const calendarInput = document.querySelector(
          ".new-invoice__inner .calendar"
        );
        const targetStatus = findInvoiceId()
          .childNodes[1].childNodes[1].children[2].lastElementChild.firstElementChild.textContent.trim()
          .toLowerCase();

        senderAddress.street = senderStreet;
        senderAddress.country = senderCountry;
        senderAddress.city = senderCity;
        senderAddress.postCode = senderPost;
        data.description = inputDescription;
        //change term
        const term = defineCurrentTerm();
        data.paymentTerms = term;
        selectCurrentTerm();
        //
        clientAddress.street = clientStreet;
        clientAddress.country = clientCountry;
        clientAddress.city = clientCity;
        clientAddress.postCode = clientPost;
        data.clientEmail = clientEmail;
        //change Due date
        const changeDueDate = function () {
          const dueDate = new Date(calendarInput.value);
          const paymentDue = new Date(
            dueDate.setDate(dueDate.getDate() + defineCurrentTerm())
          );
          const dueDay = paymentDue.getDate();
          const dueMonth = paymentDue.getMonth() + 1;
          const dueYear = paymentDue.getFullYear();
          const finalDueDate = `${dueYear}-${
            dueMonth < 10 ? `0${dueMonth}` : dueMonth
          }-${dueDay < 10 ? `0${dueDay}` : dueDay}`;
          return finalDueDate;
        };
        data.paymentDue = changeDueDate();
        const dueDate = data.paymentDue;
        //
        // calc Final Price
        const finalPrice = +calcFinalPrice(
          document.querySelectorAll(".new-invoice__inner .price-total")
        );
        //create inner page with new data

        const id = data.id;
        const invoiceDate = data.createdAt;

        // create new items
        const allItems = document.querySelectorAll(
          ".new-invoice__inner .invoice__item"
        );

        let arr = [];

        allItems.forEach((it) => {
          const itemName = it.children[0].childNodes[3].value;
          const itemQty = +it.children[1].childNodes[1].lastElementChild.value;
          const itemPrice =
            +it.children[1].childNodes[3].lastElementChild.value;
          const itemTotal =
            +it.children[1].children[2].childNodes[3].textContent;

          const itemObj = {
            name: itemName,
            quantity: itemQty,
            price: itemPrice,
            total: itemTotal,
          };
          arr.push(itemObj);
        });

        const sendItemsDataToJSON = async function () {
          let headersList = {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
          };

          let bodyContent = JSON.stringify({
            id: id,
            createdAt: invoiceDate,
            paymentDue: dueDate,
            description: inputDescription,
            paymentTerms: term,
            clientName: clientName,
            clientEmail: clientEmail,
            status: targetStatus,
            senderAddress: {
              street: senderStreet,
              city: senderCity,
              postCode: senderPost,
              country: senderCountry,
            },
            clientAddress: {
              street: clientStreet,
              city: clientCity,
              postCode: clientPost,
              country: clientCountry,
            },
            items: arr,
            total: finalPrice,
          });

          await fetch(`http://localhost:3000/data/${id}`, {
            method: "PUT",
            body: bodyContent,
            headers: headersList,
          });
        };
        sendItemsDataToJSON();
      };

      saveChangesBtn.addEventListener("click", handleDataChange);
    };

    btnEdit.addEventListener("click", editInvoice);

    // Mark as Paid
    const markBtn = document.querySelector(".btn__mark");
    if (markBtn === null) {
      return;
    } else if (data.status === "draft" || data.status === "paid") {
      markBtn.style.display = "none";
    }

    const handleStatus = function () {
      markBtn.remove();
      const id = data.id;
      const changeStatus = async function () {
        let headersList = {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json",
        };

        let bodyContent = JSON.stringify({
          status: "paid",
        });

        await fetch(`http://localhost:3000/data/${id}`, {
          method: "PATCH",
          body: bodyContent,
          headers: headersList,
        });
      };
      changeStatus();
    };
    markBtn.addEventListener("click", handleStatus);
  };

  const calcInvoicesNum = function () {
    document.querySelector(".invoice-count").textContent =
      document.querySelectorAll(".invoice").length;
  };
  calcInvoicesNum();

  const toggleFilterMenu = function () {
    const filterMenu = document.querySelector(".filter__menu");
    const filterImg = document.querySelector(".filter img");
    const filterCheckbox = document.querySelectorAll(".filter__menu input");

    filterMenu.classList.toggle("active");
    filterMenu.classList.contains("active")
      ? filterImg.setAttribute("src", "../src/images/icon-arrow-up.svg")
      : filterImg.setAttribute("src", "../src/images/icon-arrow-down.svg");

    filterCheckbox.forEach((box) => {
      const controlInvoices = function () {
        const invoicesArray = Array.from(invoices);
        const id = box.getAttribute("id");
        const filterInvoices = invoicesArray.filter((inv) =>
          inv.classList.contains(id)
        );
        filterInvoices.forEach((el) => el.classList.toggle("shown"));
        invoicesArray.map((el) => {
          !el.classList.contains("shown")
            ? (el.style.display = "none")
            : (el.style.display = "block");
        });
      };
      box.addEventListener("click", function () {
        box.classList.toggle("active");
        if (box.classList.contains("active")) {
          controlInvoices();
        } else {
          controlInvoices();
        }
        if (Array.from(invoices).every((inv) => inv.style.display === "none"))
          Array.from(invoices).every((inv) => (inv.style.display = "block"));
      });
    });
  };

  const formValidation = function () {
    allInputs.forEach((inp) => {
      const targetMessage = inp.closest("div").children[0].childNodes[3];
      inp.addEventListener("input", function () {
        if (inp.value != "") targetMessage.style.display = "none";
      });
      if (inp.value == "") {
        errorMessage.forEach((msg) => (msg.style.display = "block"));
      } else {
        overlayControl();
        createNewInvoice("orange", "Pending");
        calcInvoicesNum();
      }
    });
  };

  /*   Event Handlers   */

  filterBtn.addEventListener("click", toggleFilterMenu);
  colTwo.addEventListener("click", overlayControl);
  createInvoice.addEventListener("click", function () {
    newInvoice.classList.add("active");
    invoicesContainer.style.zIndex = "-1";
    document.body.style.overflowY = "hidden";
  });
  addItems.addEventListener("click", function () {
    createNewItem(document.querySelector(".items-container"));
  });
  backBtn.addEventListener("click", overlayControl);
  btnDiscard.addEventListener("click", overlayControl);

  btnDraft.addEventListener("click", function () {
    createNewInvoice("grey", "Draft");
    overlayControl();
    createNewJSONData();
    emptyInputs();
  });
  btnSave.addEventListener("click", function () {
    formValidation();
    createNewJSONData();
  });

  // new Data
  const createNewJSONData = function () {
    const senderStreet = document.querySelector(".sender-street").value;
    const senderCity = document.querySelector(".sender-city").value;
    const senderCountry = document.querySelector(".sender-country").value;
    const senderPost = document.querySelector(".sender-post").value;
    const clientName = document.querySelector(".client-name").value;
    const clientEmail = document.querySelector(".client-email").value;
    const clientStreet = document.querySelector(".client-street").value;
    const clientCountry = document.querySelector(".client-country").value;
    const clientCity = document.querySelector(".client-city").value;
    const clientPost = document.querySelector(".client-post").value;
    const items = document.querySelectorAll(".invoice__item");
    const inputDescription = document.querySelector(".description").value;
    const lastId = Array.from(document.querySelectorAll(".invoice .invoice-id"))
      .pop()
      .textContent.replace("#", "");
    const lastStatus = Array.from(
      document.querySelectorAll(".invoice .invoice-status")
    )
      .pop()
      .textContent.trim()
      .toLowerCase();
    const lastPrice = +Array.from(
      document.querySelectorAll(".invoice .invoice-price")
    )
      .pop()
      .textContent.replace("$", "");
    const getdate = new Date();
    const date = getdate.getDate();
    const getMonth = getdate.getMonth();
    const month = getMonth - 1;
    const year = getdate.getFullYear();
    const createdAt = `${year}-${month < 10 ? `0${month}` : month}-${
      date < 10 ? `0${date}` : date
    }`;

    const termsArray = Array.from(inputTerms);
    const [selectedTerm] = termsArray.filter((term) => term.selected);
    const paymentTerms = +selectedTerm.value;

    const obj = {
      id: lastId,
      createdAt: createdAt,
      paymentDue: calcdueDate(),
      description: inputDescription,
      paymentTerms: paymentTerms,
      clientName: clientName,
      clientEmail: clientEmail,
      status: lastStatus,
      senderAddress: {
        street: senderStreet,
        city: senderCity,
        postCode: senderPost,
        country: senderCountry,
      },
      clientAddress: {
        street: clientStreet,
        city: clientCity,
        postCode: clientPost,
        country: clientCountry,
      },
      items: [],
      total: lastPrice,
    };

    items.forEach((it) => {
      const item = it.children[1].childNodes;
      const itName = it.children[0].lastElementChild.value;
      const qty = +item[1].children[1].value;
      const price = +item[3].lastElementChild.value;
      const total = +item[5].firstElementChild.nextElementSibling.textContent;
      const itemObj = {
        name: itName,
        quantity: qty,
        price: price,
        total: total,
      };
      obj.items.push(itemObj);
    });

    const sendNewDataToJSON = async function () {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify(obj);

      await fetch("http://localhost:3000/data/", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });
    };
    sendNewDataToJSON();
  };
};
renderOuterPage();
