import { getGroupMember, getPosts, getallgroup } from './http/group-calls';

export const Memberget = (group_id, userid) =>
  getGroupMember(group_id).then((res) => {
    let ii = 0;
    let i = 0;
    const dataupdate = [];
    const dataupdates = [];
    let status = '';
    res.map((item) => {
      if (group_id == item._id && item.groupsMembers.memberstatus != 'left') {
        dataupdate[ii] = {
          groupuserid: item.userid,
          member_status: item.groupsMembers.memberstatus,
          member_pos: item.groupsMembers.position,
          grop_admin: item.userid,
          userid: item.groupsMembers.userid,
          name: item.usersdata.name,
          avatar: item.usersdata.avatar,
          groupid: item.groupsMembers.group_id,
        };
        ii++;
      }
      if (group_id == item._id) {
        if (item.groupsMembers.memberstatus != 'blocked') {
          const count = i + 1;
          dataupdates[0] = { count, groupuserid: item.userid };
          i++;
        }
        if (dataupdates.length == 0) {
          dataupdates[0] = { count: 0, groupuserid: item.userid };
        }
      }
      if (group_id == item._id || userid == item.groupsMembers.userid) {
        if (
          userid == item.userid ||
          item.groupsMembers.position == 'moderator'
        ) {
          status = 'active';
        }
      }
    });
    const send_data = {
      member: dataupdate,
      member_count: dataupdates[0],
      create_staus: status,
    };
    return send_data;
  });

export const datedifference = (date1) => {
  const dates = new Date(date1);
  const date2 = new Date();
  const diffMs = date2 - dates;
  const diffDays = Math.floor(diffMs / 86400000); // days
  const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  if (diffDays > 0) {
    return `${diffDays} days ago`;
  }
  if (diffHrs > 1) {
    return `${diffHrs} hours ago`;
  }
  if (diffMins == '0') {
    return 'Just now';
  }
  return `${diffMins} min ago`;
};

// export const PostCount = (group_id) => getPosts(group_id).then((res)=>{
//   var records = res.data;
//   var gid = group_id.group_id
//   let postcount = 0;
//   var postdata = [];
//   if(records.length > 0){

//     records.map((items)=>{
//       var currentDate = new Date().toISOString().split('T')[0];
//       var postDate = new Date(items.groupspost.createdAt).toISOString().split('T')[0];
//       if(currentDate == postDate){
//         postcount+= 1;
//         postdata[gid] = postcount;
//       }
//     });
//   }else{
//     postcount = 0;
//     postdata[gid] = postcount;
//   }
//   return postdata;
//   // if (postcount > 0) {
//   //   return postcount+" post /day"
//   // }else{
//   //   return postcount+" post /day"
//   // }
// });

export const PostCount = (data) =>
  getallgroup(data).then((resp) => {
    // console.log(resp, "response")
    const groups = resp.data;
    // console.log(groups, "groups")
    const frecord = [];
    let iterate = 0;
    const postcount = 0;
    const postdata = {};
    groups.map((gitem) => {
      const d = {};
      d.group_id = gitem._id;
      postdata[gitem._id] = 0;
      iterate++;
      getPosts(d).then((res) => {
        const records = res.data;
        const gid = gitem._id;
        if (records.length > 0) {
          records.map((items) => {
            const currentDate = new Date().toISOString().split('T')[0];
            const postDate = new Date(items.groupspost.createdAt)
              .toISOString()
              .split('T')[0];
            if (currentDate == postDate) {
              postdata[gid] = postdata[gid] + 1;
            }
          });
        }
      });
      if (groups.length == iterate) {
        frecord.push(postdata);
      }
    });
    console.log(frecord, 'frecord');
    const send_data = { postdatas: frecord };
    return send_data;
  });
