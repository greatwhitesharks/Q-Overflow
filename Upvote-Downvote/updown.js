Vue.component('post', {
  template: "#post-template",
  props: ['post'],
  data: function () {
    return {
      upvoted: false,
      downvoted: false
    };
  },
  methods: {
    upvote: function () {
      this.upvoted = !this.upvoted;
      this.downvoted = false;
    },
    downvote: function () {
      this.downvoted = !this.downvoted;
      this.upvoted = false;
    }
  },
  computed: {
    votes: function () {
      if (this.upvoted) {
        return this.post.votes + 1;
      } else if (this.downvoted) {
        return this.post.votes - 1;
      } else {
        return this.post.votes;
      }
    }
  }
});

var vm = new Vue({
  el: "#app",
  data: {
    posts: [{
				title: "A post for our reddit demo starting at 15 votes",
				votes: 15
			},
			{
				title: "Try out the upvoting, it works, I promise",
				votes: 53
			},
			{
				title: "coligo is the bomb!",
				votes: 10
			}]
  }
});