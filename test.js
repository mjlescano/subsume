import test from 'ava';
import Subsume from './';

test('new Subsume()', t => {
	const subsume = new Subsume();
	t.is(typeof subsume.id, 'string');
	t.is(subsume.id.length, 32);
	t.true(subsume.prefix.startsWith('@@['));
	t.true(subsume.prefix.endsWith(']@@'));
	t.true(subsume.postfix.startsWith('##['));
	t.true(subsume.postfix.endsWith(']##'));
	t.truthy(subsume.regex);
});

test('new Subsume(id)', t => {
	const subsume = new Subsume('unicorn');
	t.is(subsume.id, 'unicorn');
	t.is(subsume.prefix, '@@[unicorn]@@');
});

test('Subsume.parse()', t => {
	const fixture = 'some@@[7febcd0b3806fbc48c01d7cea4ed1219]@@🦄##[7febcd0b3806fbc48c01d7cea4ed1219]## random text';
	const id = '7febcd0b3806fbc48c01d7cea4ed1219';

	t.deepEqual(Subsume.parse(fixture, id), {
		data: '🦄',
		rest: 'some random text'
	});
});

test('Subsume.parseAll(str, ids)', t => {
	const fixture = 'some@@[7febcd0b3806fbc48c01d7cea4ed1219]@@🦄##[7febcd0b3806fbc48c01d7cea4ed1219]## random text, more@@[2a6c72d2c5f6f5fe8f8534ad96d26b3f]@@🐴##[2a6c72d2c5f6f5fe8f8534ad96d26b3f]## random text';

	const ids = [
		'7febcd0b3806fbc48c01d7cea4ed1219',
		'2a6c72d2c5f6f5fe8f8534ad96d26b3f'
	];

	t.deepEqual(Subsume.parseAll(fixture, ids), {
		data: {
			'7febcd0b3806fbc48c01d7cea4ed1219': '🦄',
			'2a6c72d2c5f6f5fe8f8534ad96d26b3f': '🐴'
		},
		rest: 'some random text, more random text'
	});
});

test('Subsume.parseAll(str)', t => {
	const fixture = 'some@@[7febcd0b3806fbc48c01d7cea4ed1219]@@🦄##[7febcd0b3806fbc48c01d7cea4ed1219]## random text, more@@[2a6c72d2c5f6f5fe8f8534ad96d26b3f]@@🐴##[2a6c72d2c5f6f5fe8f8534ad96d26b3f]## random text';

	t.deepEqual(Subsume.parseAll(fixture), {
		data: {
			'7febcd0b3806fbc48c01d7cea4ed1219': '🦄',
			'2a6c72d2c5f6f5fe8f8534ad96d26b3f': '🐴'
		},
		rest: 'some random text, more random text'
	});
});

test('Subsume#compose()', t => {
	const subsume = new Subsume();
	const text = subsume.compose('🦄');
	t.true(text.includes('🦄'));
	t.is(Subsume.parse(text, subsume.id).data, '🦄');
});

test('Subsume#parse()', t => {
	const fixture = 'some@@[7febcd0b3806fbc48c01d7cea4ed1219]@@🦄##[7febcd0b3806fbc48c01d7cea4ed1219]## random text';
	const subsume = new Subsume('7febcd0b3806fbc48c01d7cea4ed1219');

	t.deepEqual(subsume.parse(fixture), {
		data: '🦄',
		rest: 'some random text'
	});
});
