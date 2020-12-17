/**
 * @typedef {EventsDetail[]} ArrayOfEvents
 */
/**
 * Array of Objects containing Events Details
 * @typedef {Object} EventsDetail
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
 * @property {ArrayOfEvents} mapMarkers
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
 * Filters Events based on User Interaction
 * @typedef {Object} filterInteractionInterface
 * @property {Boolean} speech
 * @property {String[]} person
 * @property {String} lat
 * @property {String} long
 * @property {String} start_date
 * @property {String} end_date
 * @property {String} vid
 * @property {String} keyword
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
 * @typedef {Object[]} feedbackImages
 * @property {Number} id
 * @property {String} src
 * @property {String} thumbnail
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
 * @typedef {Object} initialDataLoadInterface
 * @property {ArrayOfEvents} vuzixMap
 * @property {Map<String, EventsId>} gps_lists
 * @property {String} startDate
 * @property {String} endDate
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
 * @typedef {String[]} UnknownValues
 * @property {String} unknown
 */
/**
* @typedef {String[]} personNameValue
* @property {String} person_name
*/

/**
 * @typedef {Object} mapObjectCenterReference
 * @property {Number} lat
 * @property {Number} lng
 */

/**
 * @typedef {Object[]} EventsId
 * @property {Number} id
 */

/**
 * @typedef {Object} parameterUpdatedValue
 * @property {String} type
 * @property {String | parameterUpdatedValue} value
 */

 /**
 * Contains the state Object 
 * @typedef {Object} VuzixAddressState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Array} addresses
 */

 /**
 * Contains the state Object 
 * @typedef {Object} DataVuzixState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Object} dataVuzix
 */
/**
 * Contains the state Object 
 * @typedef {Object} FeedbackFormState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Object} feedback
 */
/**
 * Contains the state Object 
 * @typedef {Object} InfoWindowState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Array} infoWindow
 */
/**
 * Contains the state Object 
 * @typedef {Object} FilterState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Array} mapFilter
 */
/**
 * Contains the state Object 
 * @typedef {Object} MapState
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Array} mapMarkersData
 */
/**
 * Contains the state Object 
 * @typedef {Object} SpeechTextState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Object} speechText
 */
/**
 * Contains the state Object 
 * @typedef {Object} videoURLState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {String} videoDetails
 */

/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} videoURLAction
 */
/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} SpeechActions
 */
/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} MapActions
 */
/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} FilterAction
 */
/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} InfoWindowAction
 */
/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} FeedbackFormAction
 */
/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} DataVuzixAction
 */
/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} VuzixAddressAction
 */