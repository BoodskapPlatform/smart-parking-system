ace.define("ace/snippets/groovy", ["require", "exports", "module"], function (require, exports, module) {
    "use strict";

    exports.scope = "groovy";
    exports.snippetText = "\
# Exception Handling\n\
snippet catch\n\
	catch(Exception e){}\n\
snippet throw\n\
	throw\n\
snippet throws\n\
	throws\n\
snippet try\n\
	try {\n\
	} catch(Exception e) {\n\
	}\n\
snippet try finally\n\
	try {\n\
	} catch(Exception e) {\n\
	} finally {\n\
	}\n\
# Control Statements\n\
snippet if\n\
	if (${1}){}\n\
	else {}\n\
# Loops\n\
snippet for\n\
	for (int i=0;i<${1:param};i++){}\n\
# Voice\n\
snippet voice define | voice.define\n\
	voice.define(String sid, String token, String phoneno);\n\
snippet voice send to List | voice.send\n\
	voice.send(String content, List receipents);\n\
snippet voice send | voice.send\n\
	voice.send(String content, String... receipents);\n\
# Template\n\
snippet template define\n\
	template.define(String name,String code);\n\
snippet template merge\n\
    //Merge the supplied parameters with the template \n\
	def templateString = template.merge(String name, Map params);\n\
# Rest\n\
snippet rest patch | rest.patch\n\
	rest.patch(String url);//return GetRequest\n\
snippet rest options | rest.options\n\
	rest.options(String url);//return GetRequest\n\
snippet rest post | rest.post\n\
	rest.post(String url);//return GetRequest\n\
snippet rest get | rest.get\n\
	rest.get(String url);//return GetRequest\n\
snippet rest put | rest.put\n\
	rest.put(String url);//return GetRequest\n\
snippet rest delete | rest.delete\n\
	rest.delete(String url);//return GetRequest\n\
snippet rest head | rest.head\n\
	rest.head(String url);//return GetRequest\n\
snippet rest close | rest.close\n\
	rest.close();\n\
# Logger\n\
snippet log trace | log.trace\n\
	log.trace(String log);\n\
snippet log debug | log.debug\n\
	log.debug(String log);\n\
snippet log info | log.info\n\
	log.info(String log);\n\
snippet log warn | log.warn\n\
	log.warn(String log);\n\
snippet log error | log.error\n\
	log.error(String log);\n\
snippet log trace with object | log.trace\n\
	log.trace(String format, Object... args);\n\
snippet log debug with object | log.debug\n\
	log.debug(String format, Object... args);\n\
snippet log info with object | log.info\n\
	log.info(String format, Object... args);\n\
snippet log warn with object | log.warn\n\
	log.warn(String format, Object... args);\n\
snippet log error with object | log.error\n\
	log.error(String format, Object... args);\n\
# Session\n\
snippet session put | session.put\n\
	session.put(String name, Object value);\n\
snippet session get | session.get\n\
	def sessionObj = session.get(String name);\n\
snippet session clear | session.clear\n\
	session.clear();\n\
# Rules\n\
snippet rule invoke sequentially | rule.invoke\n\
	rule.invoke(String... names);\n\
snippet rule invoke sequentially list | rule.invoke\n\
	rule.invoke(List names);\n\
snippet rule invoke | rule.invoke\n\
	rule.invoke(boolean parallel, String... names);\n\
snippet rule invoke by list | rule.invoke\n\
	rule.invoke(boolean parallel,List names);\n\
# Command\n\
snippet command broadcast a Map as Json String | command.broadcast\n\
	command.broadcast(Map jsonMap, String... filters);\n\
snippet command broadcast a Map as Json String with list filters | command.broadcast\n\
	command.broadcast(Map jsonMap, List filters);\n\
snippet command broadcast a formatter message | command.broadcast\n\
	command.broadcast(int commandId, Map jsonMap, String... filters);\n\
snippet command broadcast a formatter message with list filters | command.broadcast\n\
	command.broadcast(int commandId, Map jsonMap, List filters);\n\
snippet command broadcast raw byte[] | command.broadcast\n\
	command.broadcast(byte[] data, String... filters);\n\
snippet command broadcast raw byte[] with list filters | command.broadcast\n\
	command.broadcast(byte[] data, List filters);\n\
snippet command broadcast a raw string to device | command.broadcast\n\
	command.broadcast(String data, String... filters);\n\
snippet command broadcast a raw string to device with list filter | command.broadcast\n\
	command.broadcast(String data, List filters);\n\
snippet command send a formatted JSON command to one or more device | command.send\n\
	command.send(int commandId, Map jsonMap, List deviceIds);\n\
snippet command send a formatted JSON map command to one or more device with list | command.send\n\
	command.send(int commandId, Map jsonMap, List deviceIds);\n\
snippet command send a formatted JSON  map command to one or more device | command.send\n\
	command.send(int commandId, Map jsonMap, String... deviceIds);\n\
snippet command send a formatted JSON command to one or more device | command.send\n\
	command.send(int commandId, String json, String... deviceIds);\n\
snippet command send a formatted JSON command to one or more device with list | command.send\n\
	command.send(int commandId, String json, List deviceIds);\n\
snippet command send a raw String to one or more devices | command.send\n\
	command.send(String data, String... deviceIds);\n\
snippet command send a raw String to one or more devices with list | command.send\n\
	command.send(String data, List deviceIds);\n\
snippet command send a raw byte[] to one or more devices | command.send\n\
	command.send(byte[] data, String... deviceIds);\n\
snippet command send a Map as JSON String to one or more devices | command.send\n\
	command.send(Map jsonMap, String... deviceIds);\n\
snippet command send a Map as JSON String to one or more devices with list | command.send\n\
	command.send(Map jsonMap, List deviceIds);\n\
# FCM\n\
snippet fcm define | fcm.define\n\
	fcm.define(String apiKey);\n\
snippet fcm send a content message to a list of FCM devices | fcm.send\n\
	fcm.send(String data, List receipents);\n\
snippet fcm send a content message to one or more FCM devices | fcm.send\n\
	fcm.send(String data, String... receipents);\n\
snippet fcm push notification message to one or more FCM devices | fcm.push\n\
	fcm.push(String subject, String content, String... receipents);\n\
snippet fcm push notification with data message to a list of FCM devices | fcm.push\n\
	fcm.push(String subject, String content, String data, List receipents);\n\
snippet fcm push notification with data message to one or more FCM devices | fcm.push\n\
	fcm.push(String subject, String content, String data, String... receipents);\n\
snippet fcm push notification message to a list of FCM devices | fcm.push\n\
	fcm.push(String subject, String content, List receipents);\n\
# Util\n\
snippet util format the current system time into a Date string | util.formatDate\n\
	util.formatDate(String pattern);//return String\n\
snippet util format the time millis into a Date string | util.formatDate\n\
	util.formatDate(String pattern, long millis);//return String\n\
snippet util convert a string to byte[] using BASE64 decoding | util.decodeBase64\n\
	util.decodeBase64(String value);//return byte[]\n\
snippet util get the server epoch milliseconds | util.millis\n\
	util.millis();//return long\n\
snippet util restore a UUID from string representation | util.uuid\n\
	util.uuid(String uuid);//return UUID\n\
snippet util generate a random UUID | util.uuid\n\n\
	util.uuid();//return UUID\n\
snippet util convert a JSONArray to List | util.toList\n\
	util.toList(JSONArray jsonArray);//return List\n\
snippet util convert the HEX string into byte[] | util.decodeHex\n\
	util.decodeHex(String value);//return byte[]\n\
snippet util convert a JSONObject to Map | util.toMap\n\
	util.toMap(JSONObject jsonObject)\n;//return Map\n\
# Machine Learning\n\
snippet mlearn check if a model exists | mlearn.has\n\
	mlearn.has(String relation);//return boolean\n\
snippet mlearn list the supported classifiers and it's capabilities | mlearn.classifiers\n\
	mlearn.classifiers();\n\
snippet mlearn drops a model | mlearn.drop\n\
	mlearn.drop(String relation);//return boolean\n\
snippet mlearn retrieve a model | mlearn.get\n\
	mlearn.get(String relation);//return MachineLearningModelContext\n\
snippet mlearn create a Weka machine learning model | mlearn.create\n\
	mlearn.create(String relation);//return MachineLearningAttributeContext\n\
# Record\n\
snippet record define elasticsearch record index, supported data types are (TEXT, VARCHAR, BOOLEAN, BIGINT, BLOB, DOUBLE, FLOAT, INTEGER, DATE, TIMESTAMP, UUID) | record.define\n\
	record.define(String name, int recordId, Map fields);\n\
snippet record drop a elasticsearch index | record.drop\n\
	record.drop(int recordId);\n\
snippet record delete | record.delete\n\
	record.delete(int recordId, String id);//return boolean\n\
snippet record insert a document into the elasticsearch record index with supplied ID | record.insert\n\
	record.insert(int recordId, String id, Map values);\n\
snippet record insert a document into the elasticsearch record index with default random ID | record.insert\n\
	record.insert(int recordId, Map values);//return String\n\
snippet record elastic search records index | record.search\n\
	record.search(int recordId, Map queryParams, String query);//return JSONObject\n\
# SMS\n\
snippet sms define a Twilio SMS gateway | sms.define\n\
	sms.define(String sid, String token, String primaryPhone);\n\
snippet sms send to a list of receipents | sms.send\n\
	sms.send(String content, String... receipents);\n\
snippet sms send one or more receipents | sms.send\n\
	sms.send(String content, String... receipents);\n\
# Location\n\
snippet location update a device's location, location based events are triggerd automatically | location.update\n\
	location.update(String deviceId, double lat, double lon);\n\
# Event\n\
snippet event create/update | event.define\n\
	event.define(int id, String name, String subject, String content);\n\
snippet event unregister one ore more address from a event | event.unregister\n\
	event.unregister(int eventId, String channel, String... addresses);\n\
snippet event unregister a list of addresses from a event | event.unregister\n\
	event.unregister(int eventId, String channel, List addresses);\n\
snippet event drop | event.drop\n\
	event.drop(int id);\n\
snippet event register one or more addresses to receive event notifications One of the Channel must be used (EMAIL, SMS, VOICE, FCM) | event.register\n\
	event.register(int eventId, String channel, String... addresses);\n\
snippet event register a list of addresses to receive event notifications One of the Channel must be used (EMAIL, SMS, VOICE, FCM) | event.register\n\
	event.register(int eventId, String channel, List addresses);\n\
snippet event raise will automatically trigger the notifications to the registered addresses through apropriate channels (SMS, VOICE, Email, FCM) | event.raise\n\
	event.raise(int eventId);\n\
# Email\n\
snippet email define the SMTP Email Gateway | email.define\n\
	email.define(String host, int port, String user, String password, boolean ssl, boolean tls, String primaryEmail, String bounceEmail);\n\
snippet email send a HTML to a list of receipents with the provided subject and content | email.htmlSend\n\
	email.htmlSend(String subject, String content, List receipents);\n\
snippet email send a HTML to one of more receipents with the provided subject and content | email.htmlSend\n\
	email.htmlSend(String subject, String content, String... receipents);\n\
snippet email send an embedded HTML email to a list of receipents with the provided subject and content | email.embedHtmlSend\n\
	email.embedHtmlSend(String subject, String content, String dsResolver, List receipents);\n\
snippet email send an email to a list of receipents with the provided subject and content | email.send\n\
	email.send(String subject, String content, List receipents);\n\
snippet email send an embedded HTML to one of more receipents with the provided subject and content | email.embedHtmlSend\n\
	email.embedHtmlSend(String subject, String content, String dsResolver, String... receipents);\n\
snippet email send an email to one of more receipents with the provided subject and content | email.send\n\
	email.send(String subject, String content, String... receipents);\n\
# Domain\n\
snippet create/update message specification | domain.defineMessage\n\
	domain.defineMessage(String name, int messageId, Map fields);\n\
snippet drop a message specification | domain.dropMessage\n\
	domain.dropMessage(int messageId);\n\
snippet creates a Domain User | domain.createUser\n\
	domain.createUser(String email, String password, String firstName, String lastName, String primaryPhone);\n\
snippet create/update an Asset | domain.createAsset\n\
	domain.createAsset(String assetId, String name, String desc); //return AssetContext\n\
snippet create/update a Device | domain.createDevice\n\
	domain.createDevice(String deviceId, String name, String desc); //return DeviceContext\n\
snippet create/update a DomainAssetGroup with the given groupId and name | domain.createAssetGroup\n\
	domain.createAssetGroup(int groupId, String name); //return DomainAssetGroupContext\n\
snippet create/update a DomainDeviceGroup with the given groupId and name | domain.createDeviceGroup\n\
	domain.createDeviceGroup(int groupId, String name); //return DomainDeviceGroupContext\n\
snippet create/update a DomainUserGroup with the given groupId and name | domain.createUserGroup\n\
	domain.createUserGroup(int groupId, String name); //return DomainDeviceGroupContext\n\
snippet retrieves the DomainAssetGroupContext of the given groupId | domain.assetGroup\n\
	domain.assetGroup(int groupId); //return DomainAssetGroupContext\n\
snippet retrieves the DomainDeviceGroupContext of the given groupId | domain.deviceGroup\n\
	domain.deviceGroup(int groupId); //return DomainDeviceGroupContext\n\
snippet retrieves the DomainUserGroupContext of the given groupId | domain.userGroup\n\
	domain.userGroup(int groupId); //return DomainUserGroupContext\n\
snippet retrieves the AssetContext of the given assetId | domain.asset\n\
	domain.asset(String assetId); //return AssetContext\n\
snippet retrieves the UserContext of the given userId/email | domain.user\n\
	domain.user(String userId); //return UserContext\n\
snippet retrieves the DeviceContext of the given deviceId | domain.device\n\
	domain.device(String deviceId); //retutn DeviceContext\n\
snippet retrieves the GeofenceContext of the given geofenceName | domain.geofence\n\
	domain.geofence(String geofenceName); //return GeofenceContext\n\
snippet Store a named property with one of the formats. Upon retreival JSON properties are returned as Map, HEX properties a hex decoded and returned as byte[], BASE64 properties a base64 decoded and returned as byte[] | domain.property \n\
	domain.property(String format, String name, String value);\n\
snippet retrieve a stored property, return data is formatted if a format is specified while storing | domain.property\n\
	domain.property(String name); //return Object\n\
snippet storage a named property | domain.property\n\
	domain.property(String name, String value);\n\
snippet retrieve a stored lookup value in its original format | domain.get\n\
	domain.get(String name); //return Object\n\
snippet retrieve a stored lookup value in its original format, if not found returns the passed def value | domain.get\n\
	domain.get(String name, Object def); //return Object\n\
snippet store a String value in the lookup table | domain.put\n\
	domain.put(String name, String value); //return BaseLookupContext\n\
snippet store a UUID value in the lookup table | domain.put\n\
	domain.put(String name, UUID value); //return BaseLookupContext\n\
snippet store a long value in the lookup table | domain.put\n\
	domain.put(String name, long value); //return BaseLookupContext\n\
snippet store a byte[] value in the lookup table | domain.put\n\
	domain.put(String name, byte[] value); //return BaseLookupContext\n\
snippet store a float value in the lookup table | domain.put\n\
	domain.put(String name, float value); //return BaseLookupContext\n\
snippet store a boolean value in the lookup table | domain.put\n\
	domain.put(String name, boolean value); //return BaseLookupContext\n\
snippet store a byte value in the lookup table | domain.put\n\
	domain.put(String name, byte value); //return BaseLookupContext\n\
snippet store a short value in the lookup table | domain.put\n\
	domain.put(String name, short value); //return BaseLookupContext\n\
snippet store a integer value in the lookup table | domain.put\n\
	domain.put(String name, int value); //return BaseLookupContext\n\
snippet store a double value in the lookup table | domain.put\n\
	domain.put(String name, double value); //return BaseLookupContext\n\
snippet retrieve a stored property, return data is formatted if a format is specified while storing | domain.getProperty\n\
	domain.getProperty(String name, String def); //return Object\n\
# SQL \n\
snippet update/merge a record into a sql table | sql.update\n\
	sql.update(String table, Map data); //return Integer\n\
snippet execute a stored sql template and return results | sql.execute\n\
	sql.execute(String tempateId, Map args); //return Map\n\
snippet execute a sql query and return results | sql.execute\n\
	sql.execute(String query); //return Map\n\
snippet insert a record into sql table | sql.insert\n\
	sql.insert(String table, Map data)\n\
    ";
});