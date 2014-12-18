// Generated by IcedCoffeeScript 1.7.1-c
(function() {
  var C, Encryption, K, Packet, dh, iced, konst, make_esc, __iced_k, __iced_k_noop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-runtime').iced;
  __iced_k = __iced_k_noop = function() {};

  konst = require('../../const');

  K = konst.kb;

  C = konst.openpgp;

  Packet = require('./base').Packet;

  make_esc = require('iced-error').make_esc;

  dh = require('../../nacl/main').dh;

  Encryption = (function(_super) {
    __extends(Encryption, _super);

    Encryption.ENC_TYPE = K.public_key_algorithms.NACL_DH;

    Encryption.tag = function() {
      return K.packet_tags.encryption;
    };

    Encryption.prototype.tag = function() {
      return Encryption.tag();
    };

    function Encryption(_arg) {
      this.encrypt_for = _arg.encrypt_for, this.sign_with = _arg.sign_with, this.plaintext = _arg.plaintext, this.ciphertext = _arg.ciphertext, this.sender_key = _arg.sender_key, this.nonce = _arg.nonce;
      Encryption.__super__.constructor.call(this);
      this.emphemeral = false;
    }

    Encryption.prototype.get_packet_body = function() {
      var enc_type;
      enc_type = Signature.SIG_TYPE;
      return {
        sender_key: this.sender_key,
        ciphertext: this.ciphertext,
        nonce: this.nonce,
        enc_type: enc_type
      };
    };

    Encryption.alloc = function(_arg) {
      var a, b, body, err, ret, tag;
      tag = _arg.tag, body = _arg.body;
      ret = null;
      err = tag !== Encryption.tag() ? new Error("wrong tag found: " + tag) : (a = body.enc_type) !== (b = Encryption.ENC_TYPE) ? err = new Error("Expected Curve25519 DH (type " + b + "); got " + a) : (ret = new Encryption(body), null);
      if (err != null) {
        throw err;
      }
      return ret;
    };

    Encryption.prototype.is_signature = function() {
      return false;
    };

    Encryption.prototype.get_sender_keypair = function(_arg, cb) {
      var encrypt, err, ret, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      encrypt = _arg.encrypt;
      err = ret = null;
      (function(_this) {
        return (function(__iced_k) {
          if (_this.sign_with != null) {
            return __iced_k(ret = _this.sign_with.get_keypair());
          } else {
            (function(__iced_k) {
              if (_this.sender_keypair != null) {
                return __iced_k(ret = _this.sender_keypair);
              } else {
                (function(__iced_k) {
                  var _ref;
                  if (encrypt) {
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "/Users/max/src/keybase/kbpgp/src/keybase/packet/encryption.iced",
                        funcname: "Encryption.get_sender_keypair"
                      });
                      dh.Pair.generate({}, __iced_deferrals.defer({
                        assign_fn: (function(__slot_1) {
                          return function() {
                            err = arguments[0];
                            return __slot_1.sender_keypair = arguments[1];
                          };
                        })(_this),
                        lineno: 55
                      }));
                      __iced_deferrals._fulfill();
                    })(function() {
                      ret = _this.sender_keypair;
                      return __iced_k(_this.emphemeral = true);
                    });
                  } else {
                    return __iced_k(_this.sender_key != null ? ((_ref = dh.Pair.parse_kb(_this.sender_key), err = _ref[0], _this.sender_keypair = _ref[1], _ref), err == null ? ret = _this.sender_keypair : void 0) : err = new Error("Cannot encrypt without a sender keypair"));
                  }
                })(__iced_k);
              }
            })(__iced_k);
          }
        });
      })(this)((function(_this) {
        return function() {
          return cb(err, ret);
        };
      })(this));
    };

    Encryption.prototype.encrypt = function(cb) {
      var esc, plaintext, recvr, sender, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "encrypt");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/kbpgp/src/keybase/packet/encryption.iced",
            funcname: "Encryption.encrypt"
          });
          _this.get_sender_keypair({
            encrypt: true
          }, esc(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return sender = arguments[0];
              };
            })(),
            lineno: 70
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          recvr = _this.encrypt_for.get_keypair();
          plaintext = Buffer.concat([_this.plaintext, new Buffer([_this.emphemeral ? 1 : 0])]);
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/max/src/keybase/kbpgp/src/keybase/packet/encryption.iced",
              funcname: "Encryption.encrypt"
            });
            recvr.encrypt_kb({
              plaintext: plaintext,
              sender: sender
            }, esc(__iced_deferrals.defer({
              assign_fn: (function(__slot_1, __slot_2) {
                return function() {
                  __slot_1.ciphertext = arguments[0].ciphertext;
                  return __slot_2.nonce = arguments[0].nonce;
                };
              })(_this, _this),
              lineno: 76
            })));
            __iced_deferrals._fulfill();
          })(function() {
            return cb(null);
          });
        };
      })(this));
    };

    Encryption.prototype.decrypt = function(cb) {
      var args, esc, plaintext, recvr, sender, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "decrypt");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/kbpgp/src/keybase/packet/encryption.iced",
            funcname: "Encryption.decrypt"
          });
          _this.get_sender_keypair({}, esc(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return sender = arguments[0];
              };
            })(),
            lineno: 83
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          args = {
            ciphertext: _this.ciphertext,
            nonce: _this.nonce,
            sender: sender
          };
          recvr = _this.encrypt_for.get_keypair();
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/max/src/keybase/kbpgp/src/keybase/packet/encryption.iced",
              funcname: "Encryption.decrypt"
            });
            recvr.decrypt_kb(args, esc(__iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return plaintext = arguments[0];
                };
              })(),
              lineno: 86
            })));
            __iced_deferrals._fulfill();
          })(function() {
            _this.plaintext = plaintext.slice(0, -1);
            _this.emphemeral = plaintext.slice(-1)[0];
            return cb(err, {
              keypair: sender,
              plaintext: _this.plaintext,
              emphemeral: _this.emphemeral
            });
          });
        };
      })(this));
    };

    Encryption.prototype.unbox = function(cb) {
      var err, res, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/kbpgp/src/keybase/packet/encryption.iced",
            funcname: "Encryption.unbox"
          });
          _this.decrypt(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return res = arguments[1];
              };
            })(),
            lineno: 94
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return cb(err, res);
        };
      })(this));
    };

    Encryption.box = function(_arg, cb) {
      var encrypt_for, err, packet, plaintext, sign_with, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      sign_with = _arg.sign_with, encrypt_for = _arg.encrypt_for, plaintext = _arg.plaintext;
      packet = new Encryption({
        sign_with: sign_with,
        encrypt_for: encrypt_for,
        plaintext: plaintext
      });
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/kbpgp/src/keybase/packet/encryption.iced",
            funcname: "Encryption.box"
          });
          packet.encrypt(__iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return err = arguments[0];
              };
            })(),
            lineno: 101
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (typeof err !== "undefined" && err !== null) {
            packet = null;
          }
          return cb(err, packet);
        };
      })(this));
    };

    return Encryption;

  })(Packet);

  exports.Signature = Signature;

  exports.sign = Signature.sign;

}).call(this);