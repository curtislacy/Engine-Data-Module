var base = require( '../ProducerBase.js' );

function ImapMessageProducer() {
    base.init( this );
}
base.inherit( ImapMessageProducer );

ImapMessageProducer.prototype.getMatchPatterns = function() {
	return [ '^acct:((imap)|(gmail)):.+', '/message/(?!(x-gm-msgid)|(message-id)|(.+/uid)).+/[0-9]+$' ];
}
ImapMessageProducer.prototype.attemptRequest = function( uri, owner, source, resource, keys, callback ) {
	var self = this;
	var parsedResource = resource.match( /\/message\/(.+)\/([0-9]+)/ );
	var mailbox = parsedResource[1];
	var messageId = parseInt( parsedResource[2] );

	ImapService.fetchBySeqNo( owner, keys, mailbox, messageId, 
        function( error, data ){
            if( error )
                callback( error, null );
            else if( data )
                callback( null, {
                    'uri': uri, 
                    'data': data
                });
            else
            {
                var error = new Error( '(ImapMessageProducer) Undefined message data[0] for uri: ' + uri );
                error.data = data;
                error.uri = uri;
                callback( error, null );
            }
        } );
};

module.exports = exports = ImapMessageProducer;
