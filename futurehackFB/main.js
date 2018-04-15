ELEMENT.locale(ELEMENT.lang.en);

var sports = [];
var gaming = [];
var study = [];
var eat = [];
var movie = [];
var conversation = [];
var others = [];

var users = [];

function updateUser() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var userId = firebase.auth().currentUser.uid;
      return firebase
        .database()
        .ref("/users/" + userId)
        .once("value")
        .then(function(snapshot) {
          var username =
            (snapshot.val() && snapshot.val().username) || "Anonymous";
          // ...
        });
    } else {
      this.$activeUser = {
        name: "",
        university: "",
        iD: "",
        email: "",
        password: "",
        interest: ""
      };
    }
  });
}

Vue.prototype.$activeUser = new Vue({
  data: {
    name: "",
    university: "",
    iD: "",
    email: "",
    password: "",
    interest: ""
  }
});

Vue.prototype.$posts = new Vue({
  data: {
    arr: []
  }
});

Vue.prototype.$joined = new Vue({
  data: {
    arr: []
  }
});

Vue.prototype.$loggedIn = new Vue({
  data: {
    state: false
  }
});

Vue.component("joined", {
  // props: ["activity", "place", "time", "no"],
  template: `
                          <div>
                            <div style="padding-bottom: 5px" v-for="(post, index) in $joined.arr" :key="index">
                                <el-card class="box-card">
                                    <el-row>
                                        <el-col :span="20">
                                            <el-row>
                                                <span class="activity text">{{post.activity}}</span>
                                                <span class="joined text">{{post.no}} more friends are joining</span>
                                            </el-row>
                                            <el-row>
                                                <span class="time text">{{post.time.toString()}}</span>
                                            </el-row>
                                            <el-row>
                                                <span class="time text">{{post.place}}</span>
                                            </el-row>
                                        </el-col>
                                      
                                    </el-row>
                                </el-card>
                            </div>
                            </div>
`
});

Vue.component("container", {
  // props: ["activity", "place", "time", "no"],
  template: `
                          <div>
                            <div style="padding-bottom: 5px" v-for="(post, index) in $posts.arr" :key="index">
                                <el-card class="box-card">
                                    <el-row>
                                        <el-col :span="20">
                                            <el-row>
                                                <span class="activity text">{{post.activity}}</span>
                                                <span class="joined text">{{post.no}} more friends are joining</span>
                                            </el-row>
                                            <el-row>
                                                <span class="time text">{{post.time.toString()}}</span>
                                            </el-row>
                                            <el-row>
                                                <span class="time text">{{post.place}}</span>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-button type="primary" @click.native="join(index)">Join</el-button>
                                        </el-col>
                                    </el-row>
                                </el-card>
                            </div>
                            </div>
`,
  methods: {
    joined(key) {
      return this.$posts.arr[key].joined == "true";
    },
    join(key) {
      if (!this.$loggedIn.state) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: teal" },
            "Please log in to join activity."
          )
        });
      } else if (this.$posts.arr[key].joined == true) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h("i", { style: "color: teal" }, "Already joined!")
        });
      } else {
        this.$posts.arr[key].no = parseInt(this.$posts.arr[key].no) + 1;
        this.$posts.arr[key].joined = true;
        this.$joined.arr.push(this.$posts.arr[key]);
      }
    }
  }
});

Vue.component("activitymenu", {
  template: `
  <div class="text">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">Sports</el-menu-item>
      <el-menu-item index="2">Gaming</el-menu-item>
      <el-menu-item index="3">Study</el-menu-item>
      <el-menu-item index="4">Eat</el-menu-item>
      <el-menu-item index="5">Movie</el-menu-item>
      <el-menu-item index="6">Conversation</el-menu-item>
      <el-menu-item index="7">Others</el-menu-item>
    </el-menu>
    
  </div>
`,
  data() {
    return {
      activeIndex: "1"
    };
  },

  methods: {
    handleSelect(key, keyPath) {
      if (key == "1") {
        this.$posts.arr = sports;
      } else if (key == "2") {
        this.$posts.arr = gaming;
      } else if (key == "3") {
        this.$posts.arr = study;
      } else if (key == "4") {
        this.$posts.arr = eat;
      } else if (key == "5") {
        this.$posts.arr = movie;
      } else if (key == "6") {
        this.$posts.arr = conversation;
      } else if (key == "7") {
        this.$posts.arr = others;
      } else {
        this.$posts.arr = null;
      }
    }
  }
});

Vue.component("top", {
  template: `

    <div class="text">
      <el-row>
        <el-col :span="14" :offset="2">
          <img src="images/logo.jpeg" alt="Match Up Logo" width="120" height="60">
        </el-col>
        <el-col :span="4" v-if="$loggedIn.state">
          <span class="text" style="padding-top: 10px; display: inline-block; font-size: 18px">Welcome {{$activeUser.name}} !</span>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search">Search</el-button>
        </el-col>
        
        <el-col :span="2" v-if="$loggedIn.state">
          <el-button @click.native="logOut" >Log Out</el-button>
        </el-col>
        <el-col :span="2" v-if="!$loggedIn.state">
          <el-button @click="dialogLoginVisible = true" >Login</el-button>

            <el-dialog title="Login" :visible.sync="dialogLoginVisible">
              <el-form :model="form">
              <el-form-item label="Email" :label-width="formLabelWidth">
              <el-input v-model="loginEmail" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password" :label-width="formLabelWidth">
              <el-input type="password" v-model="loginPassword" auto-complete="off"></el-input>
              </el-form-item>
          </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogLoginVisible = false">Cancel</el-button>
      <el-button type="primary" @click.native="login">Confirm</el-button>
    </span>
      </el-dialog>
        </el-col>
        <el-col :span="2" v-if="!$loggedIn.state">
          <el-button @click="dialogFormVisible = true">Sign Up</el-button>

            <el-dialog title="Sign Up" :visible.sync="dialogFormVisible">
              <el-form :model="form">
              <el-form-item label="Name" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="University" :label-width="formLabelWidth">
              <el-input v-model="form.university" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Student Matric ID" :label-width="formLabelWidth">
              <el-input v-model="form.iD" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Email" :label-width="formLabelWidth">
              <el-input v-model="form.email" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password" :label-width="formLabelWidth">
              <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Select Interest" :label-width="formLabelWidth">
            <el-select
                  v-model="form.interest"
                  multiple
                  collapse-tags
                  placeholder="Interest">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">Cancel</el-button>
      <el-button type="primary" @click.native="signUp">Confirm</el-button>
    </span>
      </el-dialog>
        </el-col>
      </el-row>
    </div>
  `,

  data() {
    return {
      options: [
        {
          value: "sports",
          label: "Sports"
        },
        {
          value: "gaming",
          label: "Gaming"
        },
        {
          value: "study",
          label: "Study"
        },
        {
          value: "eat",
          label: "Eat"
        },
        {
          value: "movie",
          label: "Movie"
        },
        {
          value: "conversation",
          label: "Conversation"
        },
        {
          value: "others",
          label: "Others"
        }
      ],
      dialogFormVisible: false,
      dialogLoginVisible: false,
      form: {
        name: "",
        university: "",
        iD: "",
        email: "",
        password: "",
        interest: ""
      },
      formLabelWidth: "150px",
      loginEmail: "",
      loginPassword: ""
    };
  },

  methods: {
    signUp() {
      if (
        this.form.name == "" ||
        this.form.university == "" ||
        this.form.iD == "" ||
        this.form.email == "" ||
        this.form.password == "" ||
        this.form.interest == ""
      ) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h("i", { style: "color: teal" }, "Please check your input.")
        });
      } else {
        var success = true;
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.form.email, this.form.password)
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            success = false;
            // ...
            if (errorCode == "auth/weak-password") {
              alert("The password is too weak.");
            } else {
              alert(errorMessage);
            }
            console.log(error);
          });
        if (success) {
          var ref = firebase
            .database()
            .ref()
            .child("user");
          var data = {
            name: this.form.name,
            email: this.form.email,
            university: this.form.university,
            iD: this.form.iD,
            interest: this.form.interest
          };
          ref
            .child(this.form.iD)
            .set(data)
            .then(
              function(ref) {
                //use 'child' and 'set' combination to save data in your own generated key
                console.log("Saved");
                $location.path("/profile");
              },
              function(error) {
                console.log(error);
              }
            );
          const h = this.$createElement;

          this.$notify({
            title: "Success",
            message: h("i", { style: "color: teal" }, "Successfully signed up!")
          });
          this.dialogFormVisible = false;
          console.log(this.$loggedIn.state);
        }
      }
    }
  },
  login() {
    if (this.loginEmail == "" || this.loginPassword == "") {
      const h = this.$createElement;

      this.$notify({
        title: "Error",
        message: h(
          "i",
          { style: "color: teal" },
          "Please fill in Email and Password."
        )
      });
    } else {
      var success = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function(error) {
          sucess = false;
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === "auth/wrong-password") {
            alert("Wrong password.");
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById("quickstart-sign-in").disabled = false;
          // [END_EXCLUDE]
        });
      if (success) {
        this.$loggedIn.state = true;
        const h = this.$createElement;

        this.$notify({
          title: "Success",
          message: h("i", { style: "color: teal" }, "Successfully logged in!")
        });
        this.dialogLoginVisible = false;
        console.log(this.$loggedIn.state);
      }
    }
  },
  logOut() {
    this.$activeUser = {
      name: "",
      university: "",
      iD: "",
      email: "",
      password: "",
      interest: ""
    };
    this.$loggedIn.state = false;
    const h = this.$createElement;

    this.$notify({
      title: "Success",
      message: h("i", { style: "color: teal" }, "Successfully logged out!")
    });
    console.log(this.$loggedIn.state);
  }
});

var app = new Vue({
  el: "#app",
  data() {
    return {
      inputActivity: "",
      inputLocation: "",
      inputName: "",
      inputFaculty: "",
      inputID: "",
      inputtime: "",
      options: [
        {
          value: "sports",
          label: "Sports"
        },
        {
          value: "gaming",
          label: "Gaming"
        },
        {
          value: "study",
          label: "Study"
        },
        {
          value: "eat",
          label: "Eat"
        },
        {
          value: "movie",
          label: "Movie"
        },
        {
          value: "conversation",
          label: "Conversation"
        },
        {
          value: "others",
          label: "Others"
        }
      ],
      value: "",
      interest: ""
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${
          files.length
        } files this time, add up to ${files.length + fileList.length} totally`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    confirm() {
      console.log(this.$loggedIn.state);
      if (!this.$loggedIn.state) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: teal" },
            "Please log in to add activity."
          )
        });
      } else if (
        this.inputActivity == "" ||
        this.inputtime == "" ||
        this.inputLocation == "" ||
        this.value == ""
      ) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h("i", { style: "color: teal" }, "Please check your inputs.")
        });
      } else {
        switch (this.value) {
          case "sports":
            sports.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1"
            });
            console.log("Success");
            break;
          case "gaming":
            gaming.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1"
            });
            console.log("Success");
            break;
          case "study":
            study.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1"
            });
            console.log("Success");
            break;
          case "eat":
            eat.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1"
            });
            console.log("Success");
            break;
          case "movie":
            movie.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1"
            });
            console.log("Success");
            break;
          case "conversation":
            conversation.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1"
            });
            console.log("Success");
            break;
          case "others":
            others.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1"
            });
            console.log("Success");
            break;
          default:
            console.log("unknown category");
        }
        const h = this.$createElement;

        this.$notify({
          title: "Success",
          message: h(
            "i",
            { style: "color: teal" },
            "Your activity has been added successfully!"
          )
        });
      }
    }
  }
});
