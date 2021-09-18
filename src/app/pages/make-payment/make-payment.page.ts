import { Component, OnInit } from "@angular/core";
import { utils } from "protractor";
import { ApiService } from "src/app/api.service";
import { UtilService } from "src/app/util.service";
declare var Stripe;
declare var RazorpayCheckout: any;
@Component({
  selector: "app-make-payment",
  templateUrl: "./make-payment.page.html",
  styleUrls: ["./make-payment.page.scss"],
})
export class MakePaymentPage implements OnInit {
  profile: any;
  address: string;
  date: string;
  totalItems: any = [];
  totalPayment: any;
  qty = 0;
  couponType: any;
  discount = 0;
  disPay: number;
  dataTrue: boolean = true;
  err: any;
  isBtn = false;
  currency: string;
  stripe: any;
  razor: any;
  card: any;
  payment_token: any;
  currency_: any;
  payment: any;

  payment_div: any = [
    {
      name: "CashPay",
      checked: true,
    },
    {
      name: "BankTransfer",
      checked: false,
    },
  ];
  checkSelect:any = "CashPay";

  constructor(private api: ApiService, private util: UtilService) {}

  ngOnInit() {
    this.util.startLoad();
    this.currency = localStorage.getItem("currency");
    this.currency_ = localStorage.getItem("currency_symbol");
    this.api.getDataWithToken("profile").subscribe(
      (success: any) => {
        if (success.success) {
          this.profile = success.data.name;
          this.util.dismissLoader();
        }
      },
      (err) => {}
    );
  }

  ionViewWillEnter() {
    this.address = localStorage.getItem("SelectAddress");
    this.date = localStorage.getItem("date");
    this.totalItems = JSON.parse(localStorage.getItem("cart-data"));
    this.totalPayment = localStorage.getItem("totalAmount");

    this.totalItems.forEach((element) => {
      this.qty += element.qty;
    });

    this.couponType = localStorage.getItem("discount_type");
    this.discount = parseInt(localStorage.getItem("discount_"));

    if (this.discount >= 0) {
      this.discountTotal();
    }
  }

  discountTotal() {
    if (this.couponType == "Percentage") {
      this.disPay = (this.totalPayment * this.discount) / 100;
      this.totalPayment -= this.disPay;
    }
    if (this.couponType == "Amount") {
      this.disPay = this.discount;
      this.totalPayment = this.totalPayment - this.discount;
    }
  }


  checkboxChange(e) {
    this.payment_div.forEach((element) => {
      element.checked = false;
    });
    e.checked = true;
    this.checkSelect = e.name;
    console.log(this.checkSelect);
  }

  cash(){
    this.util.startLoad();
    this.isBtn = true;
    let data = {
      addr_id: localStorage.getItem("address-id"),
      date: this.date,
      payment: this.totalPayment,
      payment_type: "CASH ",
      products: this.totalItems,
      coupon_id: localStorage.getItem("coupon-id"),
      discount: this.disPay,
    };
    this.api.postDataWithToken("order", data).subscribe(
      (success: any) => {
        if (success.success) {
          this.util.navCtrl.navigateRoot("payment-done");
          localStorage.removeItem("address-id");
          localStorage.removeItem("date");
          localStorage.removeItem("totalAmount");
          localStorage.removeItem("SelectAddress");
          localStorage.removeItem("cart-data");
          localStorage.removeItem("discount_type");
          this.util.dismissLoader();
        }
      },
      (err) => {
        this.util.dismissLoader();
      }
    );
  }

transfer(){
  this.util.startLoad();
  this.isBtn = true;
  let data = {
    addr_id: localStorage.getItem("address-id"),
    date: this.date,
    payment: this.totalPayment,
    payment_type: "TRANSFER",
    products: this.totalItems,
    coupon_id: localStorage.getItem("coupon-id"),
    discount: this.disPay,
  };
  this.api.postDataWithToken("order", data).subscribe(
    (success: any) => {
      if (success.success) {
        this.util.navCtrl.navigateRoot("payment-done");
        localStorage.removeItem("address-id");
        localStorage.removeItem("date");
        localStorage.removeItem("totalAmount");
        localStorage.removeItem("SelectAddress");
        localStorage.removeItem("cart-data");
        localStorage.removeItem("discount_type");
        this.util.dismissLoader();
      }
    },
    (err) => {
      this.util.dismissLoader();
    }
  );
}
}
