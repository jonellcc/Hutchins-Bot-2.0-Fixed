'use strict';

const utils = require('../utils');
const log = require('npmlog');

module.exports = function (http, api, ctx) {  
  function handleUpload(msg, form) {
    return new Promise((resolve, reject) => {
      if (!msg.attachment) return resolve();

      msg.attachment = Array.isArray(msg.attachment) ? msg.attachment : [msg.attachment];
      let uploads = [];

      for (const attachment of msg.attachment) {
        if (!utils.isReadableStream(attachment)) {
          return reject('Attachment should be a readable stream, not ' + utils.getType(attachment));
        }

        const vari = {
          source: 8,
          profile_id: ctx.userID,
          waterfallxapp: 'comet',
          farr: attachment,
          upload_id: 'jsc_c_6'
        };

        const main = http
          .postFormData('https://upload.facebook.com/ajax/react_composer/attachments/video/upload', ctx.jar, vari)
          .then(utils.parseAndCheckLogin(ctx, http))
          .then(res => {
            if (res.error || res.errors) throw res;
            return res.payload;
          });

        uploads.push(main);
      }

      Promise
        .all(uploads)
        .then(res => {
          res.forEach(payload => {
            if (payload) {
              form.input.attachments.push({
                video: { id: payload.videoID }
              });
            }
          });
          resolve();
        })
        .catch(reject);
    });
  }

  function handleUrl(msg, form) {
    return new Promise((resolve, reject) => {
      if (!msg.url) return resolve();

      const vari = {
        feedLocation: "FEED_COMPOSER",
        params: { url: msg.url },
        privacySelectorRenderLocation: "COMET_COMPOSER",
        renderLocation: "composer_preview"
      };

      http
        .post('https://www.facebook.com/api/graphql/', ctx.jar, {
          fb_api_req_friendly_name: 'ComposerLinkAttachmentPreviewQuery',
          variables: JSON.stringify(vari),
          server_timestamps: true,
          doc_id: 6549975235094234
        })
        .then(utils.parseAndCheckLogin(ctx, http))
        .then(res => {
          const linkPreview = (res[0] || res).data.link_preview;
          if (JSON.parse(linkPreview.share_scrape_data).share_type === 400) {
            throw { error: 'URL is not accepted' };
          }
          form.input.attachments.push({
            link: { share_scrape_data: linkPreview.share_scrape_data }
          });
          resolve();
        })
        .catch(reject);
    });
  }

  function handleMention(msg, form) {
    if (!msg.mentions) return;

    msg.mentions = Array.isArray(msg.mentions) ? msg.mentions : [msg.mentions];
    for (const mention of msg.mentions) {
      const { id, tag, fromIndex } = mention;

      if (typeof tag !== 'string') throw 'Mention tag must be a string';
      if (!id) throw 'ID must be a string';

      const offset = msg.body.indexOf(tag, fromIndex || 0);
      if (offset < 0) throw 'Mention for "' + tag + '" not found in message string.';

      form.input.message.ranges.push({
        entity: { id },
        length: tag.length,
        offset
      });
    }
  }

  function createContent(vari) {
    return new Promise((resolve, reject) => {
      const form = {
        fb_api_req_friendly_name: 'ComposerStoryCreateMutation',
        variables: JSON.stringify(vari),
        server_timestamps: true,
        doc_id: 6255089511280268
      };

      http
        .post('https://www.facebook.com/api/graphql/', ctx.jar, form)
        .then(utils.parseAndCheckLogin(ctx, http))
        .then(res => resolve(res))
        .catch(reject);
    });
  }
  
  return function createPost(msg, callback) {
    let cb;
    const rt = new Promise((resolve, reject) => {
      cb = (error, url) => url ? resolve(url) : reject(error);
    });

    if (typeof msg === 'function') {
      const error = 'Msg must be a string or object and not function';
      log.error('createPost', error);
      return msg(error);
    }

    if (typeof callback === 'function') cb = callback;

    const typeMsg = utils.getType(msg);
    if (!['Object', 'String'].includes(typeMsg)) {
      const error = 'Msg must be a string or object and not ' + typeMsg;
      log.error('createPost', error);
      return cb(error);
    } else if (typeMsg === 'String') msg = { body: msg };

    msg.allowUserID = msg.allowUserID ? (!Array.isArray(msg.allowUserID) ? [msg.allowUserID] : msg.allowUserID) : null;

    const sessionID = utils.getGUID();
    const base = ['EVERYONE', 'FRIENDS', 'SELF'];
    const form = {
      input: {
        composer_entry_point: !msg.groupID && msg.url ? 'share_modal' : "inline_composer",
        composer_source_surface: !msg.groupID && msg.url ? 'feed_story' : msg.groupID ? "group" : "timeline",
        composer_type: !msg.groupID && msg.url ? 'share' : msg.groupID ? "group" : "timeline",
        idempotence_token: sessionID + "_FEED",
        source: "WWW",
        attachments: [],
        audience: msg.groupID ? { to_id: msg.groupID } : {
          privacy: {
            allow: msg.allowUserID || [],
            base_state: msg.allowUserID && msg.allowUserID.length > 0 ? base[2] : (base[msg.baseState - 1] || base[0]),
            deny: [],
            tag_expansion_state: "UNSPECIFIED"
          }
        },
        message: {
          ranges: [],
          text: msg.body ? (typeof msg.body === 'object' ? JSON.stringify(msg.body, null, 2) : msg.body) : ''
        },
        with_tags_ids: [],
        inline_activities: [],
        explicit_place_id: 0,
        text_format_preset_id: 0,
        logging: { composer_session_id: sessionID },
        navigation_data: {
          attribution_id_v2: msg.groupID ? "CometGroupDiscussionRoot.react,comet.group,tap_search_bar," + Date.now() + ",909538,2361831622," : "ProfileCometTimelineListViewRoot.react,comet.profile.timeline.list,via_cold_start," + Date.now() + ",796829,190055527696468,"
        },
        is_tracking_encrypted: !!msg.url,
        tracking: [],
        event_share_metadata: { surface: "newsfeed" },
        actor_id: ctx.globalOptions.pageID || ctx.userID,
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      displayCommentsFeedbackContext: null,
      displayCommentsContextEnableComment: null,
      displayCommentsContextIsAdPreview: null,
      displayCommentsContextIsAggregatedShare: null,
      displayCommentsContextIsStorySet: null,
      feedLocation: msg.groupID ? "GROUP" : "TIMELINE",
      feedbackSource: 0,
      focusCommentID: null,
      gridMediaWidth: 230,
      groupID: null,
      scale: 1,
      privacySelectorRenderLocation: "COMET_STREAM",
      renderLocation: msg.groupID ? "group" : "timeline",
      useDefaultActor: false,
      inviteShortLinkKey: null,
      isFeed: false,
      isFundraiser: false,
      isFunFactPost: false,
      isGroup: !!msg.groupID,
      isEvent: false,
      isTimeline: !msg.groupID,
      isSocialLearning: false,
      isPageNewsFeed: !!ctx.globalOptions.pageID,
      isProfileReviews: false,
      isWorkSharedDraft: false,
      UFI2CommentsProvider_commentsKey: msg.groupID ? "CometGroupDiscussionRootSuccessQuery" : "ProfileCometTimelineRoute",
      hashtag: null,
      canUserManageOffers: false,
      __relay_internal__pv__CometUFIIsRTAEnabledrelayprovider: false,
      __relay_internal__pv__IsWorkUserrelayprovider: false,
      __relay_internal__pv__IsMergQAPollsrelayprovider: false,
      __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: false,
      __relay_internal__pv__StoriesRingrelayprovider: false
    };

    handleUpload(msg, form)
      .then(() => handleUrl(msg, form))
      .then(() => handleMention(msg, form))
      .then(() => createContent(form))
      .then(res => {
        if (res.error || res.errors) throw res;
        return cb(null, (res[0] || res).data.story_create.story.url);
      })
      .catch(err => {
        log.error('createPost', err);
        return cb(err);
      });

    return rt;
  }
};