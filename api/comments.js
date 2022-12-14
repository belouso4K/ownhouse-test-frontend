export default $axios => ({

  async index(slug, offset) {
    return await $axios.$get('/api/v1/post/'+slug+'/comments', {
      params: {
        offset
      }
    });
  },

  async addComment(slug, data) {
    return await $axios.$post('/api/v1/post/'+slug+'/comment', data);
  },

  async likeComment(id) {
    return await $axios.$post('/api/v1/post/comment/'+id+'/like');
  }

})
