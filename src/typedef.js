/**
 * Array of Objects containing Events Details
 * @typedef {Object[]} markerEventDetails
 * @property {gps_list} all_gps
 * @property {SpeechDetails} all_speech
 * @property {UnknownValues} all_uks
 * @property {Boolean} animated
 * @property {String} auto_created
 * @property {String} auto_last_modified
 * @property {String} country
 * @property {String} created
 * @property {Number} id
 * @property {Number} lat
 * @property {Number} long
 * @property {personNameValue} person_names
 * @property {String} thumbnail
 * @property {String} video
 * @property {String} vuzixID
 */
/**
 * Details of Map Object and its events
 * @typedef {Object} mapObjectReference
 * @property {mapObjectCenterReference} center
 * @property {Boolean} detail
 * @property {Boolean} initialLoad
 * @property {markerEventDetails} mapMarkers
 * @property {Object} mapObject
 * @property {Boolean} searchAsMapMoves
 * @property {Boolean} searchEventsOnCurrentLocation
 */
/**
 * Details of Filter Object 
 * @typedef {Object} mapFilterReference
 * @property {Boolean} isSpeech
 * @property {String} startDate
 * @property {String} endDate
 * @property {String} keyword
 * @property {Object[]} dateValues
 * @property {DateRangeSlider} mapDateRange
 * @property {PersonCheckList} personNames
 */
/**
 * Details of the Feedback object
 * @typedef {Object} feedbackInterface
 * @property {String} fname
 * @property {String} lname
 * @property {String} selectedImages
 * @property {feedbackImages} images
 */
/**
 * Range Slider Component 
 * @typedef {Object} DateRangeSlider
 * @property {Number[]} updated
 * @property {Number[]} values
 * @property {Number[]} domain
 * @property {Number[]} data
 */
/**
 * @typedef {Object[]} PersonCheckList
 * @property {Boolean} checked
 * @property {String} name
 */
/**
 * @typedef {Object[]} feedbackImages
 * @property {Number} id
 * @property {String} src
 * @property {String} thumbnail
 */
/**
 * @typedef {Object} initialDataLoadInterface
 * @property {markerEventDetails} vuzixMap
 * @property {Map<String, EventsId>} gps_lists
 * @property {String} startDate
 * @property {String} endDate
 */
/**
 * @typedef {Object[]} EventsId
 * @property {Number} id
 */
/**
 * @typedef {Object} mapObjectCenterReference
 * @property {Number} lat
 * @property {Number} lng
 */
/**
 * @typedef {Object[]} gps_list
 * @property {Number} lat
 * @property {Number} long
 */
/**
 * @typedef {String[]} speechDetails
 * @property {String} speech
 */
/**
 * @typedef {String[]} personNameValue
 * @property {String} person_name
 */
/**
 * @typedef {String[]} UnknownValues
 * @property {String} unknown
 */
/**
 * @typedef {Array} markersEvents
 * @property {markerEventDetails} event
 */

/**
 * @typedef {Object} DateRangeSlider
 * @property {Number[]} updated
 * @property {Number[]} values
 * @property {Number[]} domain
 * @property {Number[]} data
 */
/**
 * @typedef {Object[]} PersonCheckList
 * @property {Boolean} checked
 * @property {String} name
 */
/**
 * @typedef {Object} parameterUpdatedValue
 * @property {String} type
 * @property {String | parameterUpdatedValue} value
 */