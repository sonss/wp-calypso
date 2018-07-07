/**
 * @format
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import React from 'react';
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import { folders } from './fixtures';
import { MediaFolderDropdown } from '../media-folder-dropdown';
import SelectDropdown from 'components/select-dropdown';

const noop = rtn => rtn;

describe( 'MediaFolderDropdown', () => {
	let wrapper;
	let FIXTURE_FOLDERS_DATA;
	let FIXTURE_FOLDERS_OPTIONS;

	beforeEach( () => {
		if ( wrapper ) {
			wrapper.unmount();
		}

		FIXTURE_FOLDERS_DATA = folders;

		// Convert raw API folder data to the label/value key pairs
		// expected
		FIXTURE_FOLDERS_OPTIONS = FIXTURE_FOLDERS_DATA.map( folder => {
			return {
				value: folder.ID.toString(),
				label: folder.name,
			};
		} );
	} );

	test( 'default rendering', () => {
		wrapper = shallow(
			<MediaFolderDropdown translate={ noop } folders={ FIXTURE_FOLDERS_DATA } />
		);
		expect( wrapper.find( '.media-library__folder-dropdown' ).exists() ).toBe( true );
		expect( wrapper.find( SelectDropdown ).exists() ).toBe( true );
	} );

	test( 'does not render if no folders are provided', () => {
		wrapper = shallow( <MediaFolderDropdown translate={ noop } /> );
		expect( wrapper.find( '.media-library__folder-dropdown' ) ).toHaveLength( 0 );
	} );

	describe( 'initial folder selection', () => {
		test( 'initial folder is correctly defaulted to first', () => {
			const expected = FIXTURE_FOLDERS_DATA[ 0 ].ID;

			wrapper = shallow(
				<MediaFolderDropdown translate={ noop } folders={ FIXTURE_FOLDERS_DATA } />
			);

			expect( wrapper.find( SelectDropdown ).props().initialSelected ).toBe( expected );
		} );

		test( 'initial folder can be set via folder prop', () => {
			const expected = FIXTURE_FOLDERS_DATA[ 1 ].ID;

			wrapper = shallow(
				<MediaFolderDropdown
					translate={ noop }
					folders={ FIXTURE_FOLDERS_DATA }
					folder={ expected }
				/>
			);

			expect( wrapper.find( SelectDropdown ).props().initialSelected ).toBe( expected );
		} );
	} );

	test( 'folder options correctly merge with default option', () => {
		const defaultOption = {
			value: '/',
			label: 'All Albums',
		};

		const expected = [ defaultOption, null ].concat( FIXTURE_FOLDERS_OPTIONS );

		wrapper = shallow(
			<MediaFolderDropdown
				translate={ noop }
				folders={ FIXTURE_FOLDERS_DATA }
				defaultOption={ defaultOption }
			/>
		);

		expect( wrapper.find( SelectDropdown ).props().options ).toEqual( expected );
	} );

	test( 'the selected option value is correctly passed as argument to onFolderChange prop', () => {
		const spy = jest.fn();
		const selectedOption = FIXTURE_FOLDERS_DATA[ 0 ];
		const expected = selectedOption.value;

		wrapper = shallow(
			<MediaFolderDropdown
				translate={ noop }
				folders={ FIXTURE_FOLDERS_DATA }
				onFolderChange={ spy }
			/>
		);
		const cb = wrapper.find( SelectDropdown ).props().onSelect;

		// Call the spy
		cb( selectedOption );

		expect( spy ).toBeCalledWith( expected );
	} );

	test( 'correctly forwards disabled prop to SelectDropdown', () => {
		wrapper = shallow(
			<MediaFolderDropdown translate={ noop } folders={ FIXTURE_FOLDERS_DATA } disabled={ true } />
		);

		expect( wrapper.find( SelectDropdown ).props().disabled ).toBe( true );

		wrapper.setProps( { disabled: false } );

		expect( wrapper.find( SelectDropdown ).props().disabled ).toBe( false );
	} );
} );
