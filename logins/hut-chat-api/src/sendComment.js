"use strict";

var utils = require("../utils");
var log = require("npmlog");
var bluebird = require("bluebird");

module.exports = function (defaultFuncs, api, ctx) {
  function getGUID() {
    let _0x161e32 = Date.now(),
      _0x4ec135 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (_0x32f946) {
          let _0x141041 = Math.floor((_0x161e32 + Math.random() * 16) % 16);
          _0x161e32 = Math.floor(_0x161e32 / 16);
          let _0x31fcdd = (
            _0x32f946 == "x" ? _0x141041 : (_0x141041 & 0x3) | 0x8
          ).toString(16);
          return _0x31fcdd;
        },
      );
    return _0x4ec135;
  }

  function uploadAttachment(attachment, callback) {
    var uploads = [];

    // create an array of promises
    if (!utils.isReadableStream(attachment)) {
      throw {
        error:
          "Attachment should be a readable stream and not " +
          utils.getType(attachment) +
          ".",
      };
    }

    var form = {
      file: attachment,
      av: api.getCurrentUserID(),
      profile_id: api.getCurrentUserID(),
      source: "19",
      target_id: api.getCurrentUserID(),
      __user: api.getCurrentUserID(),
      __a: "1",
    };

    uploads.push(
      defaultFuncs
        .postFormData(
          "https://www.facebook.com/ajax/ufi/upload",
          ctx.jar,
          form,
          {},
        )
        .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
        .then(function (resData) {
          if (resData.error) {
            throw resData;
          }
          return resData.payload;
        }),
    );

    // resolve all promises
    bluebird
      .all(uploads)
      .then(function (resData) {
        callback(null, resData);
      })
      .catch(function (err) {
        log.error("uploadAttachment", err);
        return callback(err);
      });
  }

  async function sendCommentToFb(postId, text, fileID) {
    const feedback_id = Buffer.from("feedback:" + postId).toString("base64");

    const ss1 = getGUID();
    const ss2 = getGUID();

    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "CometUFICreateCommentMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "4744517358977326",
      variables: JSON.stringify({
        displayCommentsFeedbackContext: null,
        displayCommentsContextEnableComment: null,
        displayCommentsContextIsAdPreview: null,
        displayCommentsContextIsAggregatedShare: null,
        displayCommentsContextIsStorySet: null,
        feedLocation: "TIMELINE",
        feedbackSource: 0,
        focusCommentID: null,
        includeNestedComments: false,
        input: {
          attachments: fileID ? [{ media: { id: fileID } }] : null,
          feedback_id: feedback_id,
          formatting_style: null,
          message: {
            ranges: [],
            text: text,
          },
          is_tracking_encrypted: true,
          tracking: [],
          feedback_source: "PROFILE",
          idempotence_token: "client:" + ss1,
          session_id: ss2,
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.round(Math.random() * 19),
        },
        scale: 3,
        useDefaultActor: false,
        UFI2CommentsProvider_commentsKey: "ProfileCometTimelineRoute",
      }),
    };

    const res = JSON.parse(
      await api.httpPost("https://www.facebook.com/api/graphql/", form),
    );
    return res;
  }

  return async function sendComment(content, postId, callback) {
    if (typeof content === "object") {
      var text = content.body || "";
      if (content.attachment) {
        if (!utils.isReadableStream(content.attachment)) {
          throw new Error("Attachment must be a ReadableStream");
        }

        uploadAttachment(content.attachment, async function (err, files) {
          if (err) {
            return callback(err);
          }

          await sendCommentToFb(postId, text, files[0].fbid)
            .then((res) => {
              return callback(null, res);
            })
            .catch((err) => {
              return callback(err);
            });
        });
      }
    } else if (typeof content === "string") {
      var text = content;
      await sendCommentToFb(postId, text, null)
        .then((res) => {
          return callback(null, res);
        })
        .catch((_) => {
          return;
        });
    } else throw new Error("Invalid content");
  };
};
// example usage