import React, { memo, useRef, useEffect, useMemo, useCallback } from 'react';
import { useImmer, useImmerReducer } from 'use-immer';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useOutsideClick from './outsideClick';
import { SET_ABOVE, SET_DROPDOWN, RESET, FIELDS_STATE } from './const';
import multiSelectReducer, { initialState } from './reducer';

const CLASSLIST = {
    INPUT: 'multiselect_input',
    OPTION: 'multiselect_option',
    SELECTED: 'multiselect_option-selected',
    HIGHLIGHT: 'multiselect_option-highlight',
};

const KEY_PRESS = [9, 13];

const MultiSelect = props => {
    const {
        className,
        tag: Element,
        name,
        multiple,
        tabIndex,
        onGetValues,
        onGetValueSelected,
        options,
        placeholder,
        label,
        value,
        trackBy,
        disabled,
        searchable,
        selectionLabel,
        selectLabel,
        selectedLabel,
        deselectLabel,
        noOptions,
        noResult,
    } = props;
    const dropdownRef = useRef(null);
    const elementKeyRef = useRef(
        Math.random()
            .toString(36)
            .substr(2, 5),
    );
    const optionHoveredRef = useRef(null);
    const [optionSelected, setOptionSelected] = useImmer(null);
    const [optionBuilt, setOptionBuilt] = useImmer(options);
    const [state, dispatch] = useImmerReducer(multiSelectReducer, initialState);

    const handleDropdown = useCallback(e => {
        if (disabled) {
            return;
        }
        window.setTimeout(() => {
            document.getElementById(CLASSLIST.INPUT).focus();
        }, 0);
        dispatch({ type: SET_DROPDOWN, [FIELDS_STATE.DROPDOWN]: !state[FIELDS_STATE.DROPDOWN] });
        handleAbove();
        e.preventDefault();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAbove = useCallback(() => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const topOffset = dropdownRef.current.getBoundingClientRect().top;
        const relativeOffset = topOffset - scrollTop;
        const windowHeight = document.body.clientHeight;
        dispatch({ type: SET_ABOVE, [FIELDS_STATE.ABOVE]: !state[FIELDS_STATE.DROPDOWN] && relativeOffset > windowHeight / 2 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useOutsideClick(dropdownRef, () => {
        dispatch({ type: RESET });
    });

    const onPopulateSuggestions = event => {
        const {
            target: { value },
        } = event;
        setOptionBuilt(() => {
            const state = options.filter(item => {
                let key = trackBy;
                if (label) {
                    key = label;
                }
                return item[key].toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
            return state;
        });
    };

    const pushMultiOption = useCallback(
        data => {
            setOptionSelected(draft => {
                const target = document.getElementById(`${CLASSLIST.OPTION}-${elementKeyRef.current}-${data[trackBy]}`);
                const hasIndex = draft && draft.findIndex(item => item[trackBy] === data[trackBy]);
                if (hasIndex !== -1) {
                    draft.splice(hasIndex, 1);
                    target &&
                        target.classList &&
                        Array.from(target.classList).indexOf(CLASSLIST.SELECTED) > -1 &&
                        target.classList.remove(CLASSLIST.SELECTED);
                } else {
                    target && target.classList && target.classList.add(CLASSLIST.SELECTED, CLASSLIST.HIGHLIGHT);
                    draft.push(data);
                }
                return draft;
            });
        },
        [setOptionSelected, trackBy],
    );

    const pushSingleObjectOption = useCallback(
        data => {
            setOptionSelected(draft => {
                const target = document.getElementById(`${CLASSLIST.OPTION}-${elementKeyRef.current}-${data[trackBy]}`);
                if (draft && draft[trackBy]) {
                    const prevTarget = document.getElementById(`${CLASSLIST.OPTION}-${elementKeyRef.current}-${draft[trackBy]}`);
                    prevTarget &&
                        prevTarget.classList &&
                        Array.from(target.classList).indexOf(CLASSLIST.SELECTED) > -1 &&
                        prevTarget.classList.remove(CLASSLIST.SELECTED);
                }
                if (draft && draft[trackBy] === data[trackBy]) {
                    target &&
                        target.classList &&
                        Array.from(target.classList).indexOf(CLASSLIST.SELECTED) > -1 &&
                        target.classList.remove(CLASSLIST.SELECTED);
                    return null;
                }
                target && target.classList && target.classList.add(CLASSLIST.SELECTED, CLASSLIST.HIGHLIGHT);
                return data;
            });
        },
        [setOptionSelected, trackBy],
    );

    const onPushOptionSelected = useCallback(
        data => {
            if (!data) {
                return;
            }
            if (multiple) {
                pushMultiOption(data);
            } else {
                pushSingleObjectOption(data);
                dispatch({ type: RESET });
            }
        },
        [dispatch, multiple, pushMultiOption, pushSingleObjectOption],
    );

    const onSelect = (e, data) => {
        e.persist();
        onPushOptionSelected(data);
        typeof onGetValueSelected === 'function' && onGetValueSelected(data);
    };

    const onCheckSelected = data => {
        if (!optionSelected) {
            return -1;
        }
        if (multiple) {
            return optionSelected.findIndex(item => item[trackBy] === data);
        }
        return optionSelected[trackBy] === data ? 1 : -1;
    };

    const onCheckHighlight = data => {
        if (!optionHoveredRef.current) {
            return -1;
        }
        return optionHoveredRef.current[trackBy] === data ? 1 : -1;
    };

    const onMouseOverEnter = (e, data) => {
        optionHoveredRef.current = data;
        const target = document.getElementById(`${CLASSLIST.OPTION}-${elementKeyRef.current}-${data[trackBy]}`);
        target && target.classList && target.classList.add(CLASSLIST.HIGHLIGHT);
    };
    const onMouseLeave = (e, data) => {
        const target = document.getElementById(`${CLASSLIST.OPTION}-${elementKeyRef.current}-${data[trackBy]}`);
        target && target.classList && target.classList.remove(CLASSLIST.HIGHLIGHT);
    };

    const selectionMultiViewRender = () => {
        return typeof selectionLabel === 'function'
            ? selectionLabel(optionSelected)
            : optionSelected.length > 0 && `${optionSelected.length} options selected`;
    };

    const selectionViewSingleRender = () => {
        return typeof selectionLabel === 'function' ? selectionLabel({ ...optionSelected }) : optionSelected[label || trackBy];
    };

    const selectionViewRender = () => {
        if (!optionSelected || (optionSelected && optionSelected.length === 0)) {
            return <span className="multiselect_single">{placeholder}</span>;
        }
        return <span className="multiselect_single">{multiple ? selectionMultiViewRender() : selectionViewSingleRender()}</span>;
    };

    const optionsRender = useMemo(() => {
        return optionBuilt.length > 0 ? (
            optionBuilt.map(item => (
                <li
                    key={Math.random()
                        .toString(36)
                        .substring(7)}
                    role="presentation"
                    className="multiselect_element">
                    <span
                        data-select={selectLabel}
                        data-selected={selectedLabel}
                        data-deselect={deselectLabel}
                        onMouseEnter={event => onMouseOverEnter(event, item)}
                        onMouseLeave={event => onMouseLeave(event, item)}
                        onFocus={event => onMouseOverEnter(event, item)}
                        onMouseOver={event => onMouseOverEnter(event, item)}
                        onMouseDown={event => onMouseOverEnter(event, item)}
                        className={classNames(
                            CLASSLIST.OPTION,
                            `${CLASSLIST.OPTION}-${elementKeyRef.current}-${item[trackBy]}`,
                            onCheckSelected(item[trackBy]) > -1 && CLASSLIST.SELECTED,
                            onCheckHighlight(item[trackBy]) > -1 && CLASSLIST.HIGHLIGHT,
                        )}
                        id={classNames(`${CLASSLIST.OPTION}-${elementKeyRef.current}-${item[trackBy]}`)}
                        onClick={event => onSelect(event, item)}>
                        {item[label]}
                    </span>
                </li>
            ))
        ) : (
            <li className="multiselect_element">
                <span className="multiselect_option">{noResult}</span>
            </li>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionBuilt, trackBy, onCheckSelected, onCheckHighlight]);

    const noOptionsRender = () => (
        <li className="multiselect_element">
            <span className="multiselect_option">{noOptions}</span>
        </li>
    );

    const onSuggestionKeyDown = useCallback(
        e => {
            const code = e.keyCode || e.charCode;
            if (KEY_PRESS.indexOf(code) > -1 && state[FIELDS_STATE.DROPDOWN] && optionHoveredRef) {
                onPushOptionSelected(optionHoveredRef.current);
                e.preventDefault();
            }
        },
        [state, onPushOptionSelected],
    );

    const onSuggestionKeyUp = useCallback(e => {
        const code = e.keyCode || e.charCode;
        if (KEY_PRESS.indexOf(code) > -1) return;
        e.preventDefault();
    }, []);

    useEffect(() => {
        if (!value) {
            const newState = multiple ? [] : null;
            setOptionSelected(() => newState);
        } else {
            setOptionSelected(() => value);
        }
    }, [setOptionSelected, multiple, value]);

    useEffect(() => {
        if (!state[FIELDS_STATE.DROPDOWN]) {
            setOptionBuilt(() => options);
            optionHoveredRef.current = null;
        }
    }, [state, setOptionBuilt, options]);

    useEffect(() => {
        window.addEventListener('scroll', handleAbove);
        return () => {
            window.removeEventListener('scroll', handleAbove);
        };
    }, [handleAbove]);

    useEffect(() => {
        typeof onGetValues === 'function' && onGetValues(optionSelected);
    }, [optionSelected, onGetValues]);

    return (
        <Element
            className={classNames(
                'multiselect',
                className,
                state[FIELDS_STATE.DROPDOWN] && 'multiselect-active',
                // state[FIELDS_STATE.ABOVE] && 'multiselect-above',
                disabled && 'disabled',
            )}
            ref={dropdownRef}
            tabIndex={tabIndex}>
            <div className="multiselect_select" />
            <div className="multiselect_tags" onClick={handleDropdown}>
                {state[FIELDS_STATE.DROPDOWN] ? (
                    <input
                        id={CLASSLIST.INPUT}
                        name={name}
                        type="text"
                        autoComplete="off"
                        readOnly={!searchable}
                        placeholder={placeholder}
                        onChange={onPopulateSuggestions}
                        onKeyDown={onSuggestionKeyDown}
                        onKeyUp={onSuggestionKeyUp}
                        tabIndex="0"
                        className={classNames(CLASSLIST.INPUT, searchable && 'allow')}
                    />
                ) : (
                    selectionViewRender()
                )}
            </div>
            <div className="multiselect_content-wrapper">
                <ul className="multiselect_content">{options.length > 0 ? optionsRender : noOptionsRender()}</ul>
            </div>
        </Element>
    );
};

MultiSelect.defaultProps = {
    tag: 'div',
    multiple: false,
    tabIndex: 0,
    name: 'mutilselect_input',
    placeholder: 'Select option',
    trackBy: 'key',
    label: 'value',
    selectLabel: 'Press enter to select',
    selectedLabel: 'Selected',
    deselectLabel: 'Press enter to remove',
    noOptions: 'List is empty.',
    noResult: 'No elements found. Consider changing the search query.',
    disabled: false,
    searchable: true,
};

MultiSelect.propTypes = {
    className: PropTypes.string,
    tag: PropTypes.string,
    name: PropTypes.string,
    multiple: PropTypes.bool,
    tabIndex: PropTypes.number,
    onGetValues: PropTypes.func,
    onGetValueSelected: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    trackBy: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
    selectionLabel: PropTypes.func,
    selectLabel: PropTypes.string,
    selectedLabel: PropTypes.string,
    deselectLabel: PropTypes.string,
    noOptions: PropTypes.string,
    noResult: PropTypes.string,
    disabled: PropTypes.bool,
    searchable: PropTypes.bool,
};

export default memo(MultiSelect);
