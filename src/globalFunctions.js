import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

export const GetAssetImage = (imageName = 'placeholder/image.png') =>
  require(`./assets/images/${imageName}`);
export const profilePic = (image = '', name = 'E') => {
  // const BG_COLORS = ['#1570FF', '#9DDEF4', '#C2A5F9', '#FFB3DA', '#FECE00', '#F97600', '#389810'];
  try {
    if (image == undefined || image == null || image == '') {
      // return require("./assets/images/placeholder/profile-placeholder-circle.png");
      name = name == undefined || name == '' || name == null ? 'E' : name;
      const avatar = createAvatar(initials, {
        seed: name,
        scale: 80,
      });
      return avatar.toDataUriSync();
    }
    return image.indexOf('://') !== -1
      ? image
      : process.env.REACT_APP_BASEURL + image;
  } catch (error) {
    return require('./assets/images/placeholder/profile-placeholder-circle.png');
  }
};

export const errorPic = (e) => {
  // e.target.setAttribute("src") = require("./assets/images/placeholder/profile-placeholder-circle.png");
};

export const pic = (image = '') => {
  try {
    if (image == undefined || image == null || image == '') {
      return require('./assets/images/placeholder/image.jpg');
    }
    return image.indexOf('://') !== -1
      ? image
      : require(`./assets/images/${image}`);
  } catch (error) {
    return require('./assets/images/placeholder/image.jpg');
  }
};

export const defaultPic = (ev) => {
  ev.target.src = require('./assets/images/placeholder/image.png');
};

export const defaultProfilePic = (ev) => {
  ev.target.src = require('./assets/images/placeholder/profile-placeholder-circle.png');
};

export const roundvalue = (value) => Math.round(value);

export const formatDate = (datestring = '') => {
  let date;
  let year;
  let month;
  let dt;
  try {
    // date = new Date(datestring);
    // year = date.getFullYear();
    // month = date.getMonth()+1;
    // dt = date.getDate();

    // if (dt < 10) {
    // dt = '0' + dt;
    // }
    // if (month < 10) {
    // month = '0' + month;
    // }
    // return year+'-' + month + '-'+dt;

    const time = new Date(datestring).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    return time;
  } catch (error) {
    return datestring;
  }
};

export const convertDataToHtml = (block) => {
  let convertedHtml = '';
  switch (block.type) {
    case 'table':
      convertedHtml += `<table>`;
      var cotent = block.data.content;
      cotent.map((item) => {
        let trHTML = `<tr>`;
        for (let index = 0; index < item.length; index++) {
          trHTML += `<td>${item[index]}</td>`;
        }
        trHTML += `</tr>`;
        convertedHtml += trHTML;
      });
      convertedHtml += `</table>`;
      break;
    case 'header':
      convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      break;
    case 'embded':
      convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
      break;
    case 'paragraph':
      convertedHtml += `<p>${block.data.text}</p>`;
      break;
    case 'delimiter':
      convertedHtml += '<hr>';
      break;
    case 'image':
      convertedHtml += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
      break;
    case 'warning':
      convertedHtml += `<br><i class='fa fa-exclamation-triangle warning'></i><div class="cdx-block cdx-warning"><div class="cdx-input cdx-warning__title" contenteditable="false" data-placeholder="Title">${block.data.title}</div><div class="cdx-input cdx-warning__message" contenteditable="false" data-placeholder="Message">${block.data.message}</div></div><br>`;
      break;
    case 'list':
      convertedHtml += '<ul>';
      block.data.items.forEach((li) => {
        convertedHtml += `<li>${li}</li>`;
      });
      convertedHtml += '</ul>';
      break;
    default:
      console.log('Unknown block type', block.type);
      break;
  }
  return convertedHtml;
};

export function hasSpecialCharacters(inputString) {
  const pattern = /[^a-zA-Z0-9\s]/;
  return pattern.test(inputString);
}
