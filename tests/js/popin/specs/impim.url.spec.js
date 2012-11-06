describe('impim.url', function() {
    describe('.removeProtocol', function() {
        it('should return url with remove protocol removed.', function() {
            expect(impim.url.removeProtocol('http://example.com')).toBe('example.com');
        });
    });
});
