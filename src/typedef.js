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
 * @typedef {markerEvent} markerEventDetails
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
 * @typedef {Array} markersEvents
 * @property {Object} event
 */
/**
 * @typedef {Object} mapObjectReference
 * @property {mapObjectCenterReference} center
 * @property {Boolean} detail
 * @property {markersEvents} mapMarkers
 * @property {Object} mapObject
 * @property {Boolean} searchAsMapMoves
 * @property {Boolean} initialLoad
 * @property {Boolean} searchEventsOnCurrentLocation
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
 * 
 * @typedef {Object} parameterUpdatedValue
 * @property {String} type
 * @property {String | parameterUpdatedValue} value
 */
/**
 * @typedef {Object[]} feedbackImages
 * @property {Number} id
 * @property {String} src
 * @property {String} thumbnail
 */
/**
 * @typedef {Object} feedbackInterface
 * @property {String} fname
 * @property {String} lname
 * @property {String} selectedImages
 * @property {feedbackImages} images
 */