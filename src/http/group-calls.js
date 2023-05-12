import { getWalletToken } from './token-interceptor';

import { makeAxiosGetRequest, makeAxiosPostRequest } from './http-service';

/**
 * createPost
 * @param {object} data
 */

export const getallgroup = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-group`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getPostsdata = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getPostsdata`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const mygroups = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}groupsbyuser`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const particularGroups = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}particularGroup`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const followercount = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}followercount`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const allPostLikes = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}allPostLikes`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const likeAdd = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(`${process.env.REACT_APP_BASEURL}likeAdd`, true, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const hideposts = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(`${process.env.REACT_APP_BASEURL}hidepost`, true, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const publishGroup = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}publishGroup`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const UpdatesavePost = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}save-Group-post`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const savegroups = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}savegroups`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getSavepost = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-save-Group-post`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getSaveGroups = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getSaveGroups`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const joinedgroups = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}joined-user-group`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getFrndsgroup = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}frnds-group`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

/*export const getcategory = (params) => {
    return new Promise((resolve, reject) => {
        makeAxiosGetRequest(config.baseUrl + "group-category", true, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(e => {
                
                reject(e.response);
            });
    });
};*/

export const getGpCategory = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getGpCategory`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getAllBalance = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}all_balance`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const createGroup = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}create-group`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const createPost = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}create-post`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getPosts = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(`${process.env.REACT_APP_BASEURL}allPost`, true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const arChieveGroup = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}archieveGroup`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

// joined group payment check api

export const PaymentCheck = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}PaymentCheck`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const walletbalance = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}wallet-balance`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

// find by userid wise group

export const findGroups = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}findGroups`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

// Get group Members - getcurrentgrpmem

export const getGroupMember = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getGroupMember`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getcurrentgrpmem = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getCurrentGrpMem`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getPositions = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getWorkPlaces`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

//join member post api

export const JoinMember = (data) => {
  data.token = getWalletToken();
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}JoinMember`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const ApproveMember = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}ApproveMember`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const SetModurate = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}SetModurate`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const Blockmember = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}SetModurate`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const ChangeMemberStatus = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}SetModurate`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getAttchments = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}postAttachments`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const createAlbum = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}createAlbum`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getAlbums = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getAlbums`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const createEvent = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}createEvent`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getEvents = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getEvents`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const JoinEvent = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}JoinEvent`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getJoinEvents = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}userJoinEvents`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const eventJoinusers = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}eventJoinusers`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const UpdateEvent = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}UpdateEvent`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const UpdateDeletePost = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}UpdateDeletePost`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const ReceiveAllmsg = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getGroupMessage`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const SendMessage = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}send_group_Message`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const SendComments = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}send_group_Comments`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const RemoveComments = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}remove_group_Comments`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const UpdatelikeComments = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}like_group_Comments`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const groupComments = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getGroupComment`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getGroupReplyCmt = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getGroupReplyCmt`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const Purchasegroup = (data) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}purchase-group`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

// Implement 01.05.2023

export const getPostsTribes = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getTribesPost`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const inviteFriendsTribesGroup = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}tribesgroupinvitefriend`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const approveInviteTribesGroup = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}approvegroupinvitefriend`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const rejectInviteTribesGroup = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}rejectgroupinvitefriend`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};
