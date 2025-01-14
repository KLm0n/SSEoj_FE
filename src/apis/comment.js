import request from '@/utils/http';

export const getPrimaryCommentAPI = (params) => {
  const post_id = params.id;
  return request({
    url: `/api/post/${post_id}/comments/`,
    method: 'GET',
    params:{
      page:params.page_num,
      page_size:params.page_size
    }
  });
};

export const getSecondCommentAPI = (params) => {
  const post_id = params.post_id;
  const comment_id = params.comment_id;
  // console.log(`/api/post/${post_id}/comments/${comment_id}/`); // 打印 URL
  return request({
    url: `/api/post/${post_id}/comments/${comment_id}/`,
    method: 'GET',
    params:{
      page:params.page_num,
      page_size:params.page_size
    }
  });
};

export const commentPostAPI = (params) => {
  return request({
    url: `/api/post/comment/new/`,
    method: 'POST',
    data: {
      id:params.id,
      content: params.content,
      reply_to_id: params.parent_id,
      under_comment_id: params.under_comment_id
    }
  })
}

export const likeCommentAPI = (params) => {
  return request({
    url: `/api/post/comment/good/`,
    method: 'POST',
    data: {
      is_good:params.is_good,
      id:params.comment_id
    }
  })
}
