var View = require("../view");
var template = require("../tmpl/comment-form");
var CommentModel = require("../models/comment");
var CommentView = require("../views/commentView");


module.exports = Thorax.CollectionView.extend({
  name: "comment-form",
  itemView: CommentView,
  template: template,
  events: {
    "click #comment_button": function(e){
      var that = this;
      e.preventDefault();
      this.serialize(function(attrs, release){
        release();
        console.log(attrs);
        that.participantCommented(attrs);
      });
      $("#comment_form_textarea").val(""); //use this.$
    }
  },
  participantCommented: function(attrs) {
    var that = this; //that = the view
    attrs.pid = this.pid;
    attrs.zid = this.zid;

    // DEMO_MODE
    if (this.pid < 0) {
      that.trigger("commentSubmitted");
      that.updateCollection();
      return;
    }

    var comment = new CommentModel(attrs);
    comment.save().then(function() {
      that.trigger("commentSubmitted"); // view.trigger
      that.updateCollection();
    }, function() {
      alert("failed to send");
    });
  },
  updateCollection: function() {
    this.collection.fetch({
      data: $.param({
        zid: this.zid,
        pid: this.pid
      })
    });
  }
});