export type Mat4 = [ number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number ];
export type Mat3 = [ number, number, number, number, number, number, number, number, number ];
export type Mat4x3 = [ number, number, number, number, number, number, number, number, number, number, number, number ];
export type Quaternion = [ number, number, number, number ];
export type Vec4 = [ number, number, number, number ];
export type Vec3 = [ number, number, number ];
export type Vec2 = [ number, number ];

export class ML
{

    static calcIntersectionOfPlaneAndLine( planeN: Vec3, planePoint: Vec3, lineDir: Vec3, linePoint: Vec3 ): number
    {
        return this.dot3( this.sub3( planePoint, linePoint ), planeN ) / this.dot3( planeN, lineDir );
    }

    static dot3( v1: Vec3, v2: Vec3 ): number
    {
        return v1[ 0 ] * v2[ 0 ] + v1[ 1 ] * v2[ 1 ] + v1[ 2 ] * v2[ 2 ];
    }

    static cross3(v1: Vec3, v2: Vec3): Vec3
    {
        const x1 = v1[0], y1 = v1[1], z1 = v1[2];
        const x2 = v2[0], y2 = v2[1], z2 = v2[2];
        return [
          y1 * z2 - z1 * y2,
          z1 * x2 - x1 * z2,
          x1 * y2 - y1 * x2
        ];
    }

    static sub3( v1: Vec3, v2: Vec3 ): Vec3
    {
        return [ v1[ 0 ] - v2[ 0 ], v1[ 1 ] - v2[ 1 ], v1[ 2 ] - v2[ 2 ] ];
    }

    static transform4x4( m: Mat4, v: Vec4 ): Vec4
    {
        const iw = 1 / ( m[ 3 ] * v[ 0 ] + m[ 7 ] * v[ 1 ] + m[ 11 ] * v[ 2 ] + m[ 15 ] * v[ 3 ] );
        return [
            ( m[ 0 ] * v[ 0 ] + m[ 4 ] * v[ 1 ] + m[ 8 ] * v[ 2 ] + m[ 12 ] * v[ 3 ] ) * iw,
            ( m[ 1 ] * v[ 0 ] + m[ 5 ] * v[ 1 ] + m[ 9 ] * v[ 2 ] + m[ 13 ] * v[ 3 ] ) * iw,
            ( m[ 2 ] * v[ 0 ] + m[ 6 ] * v[ 1 ] + m[ 10 ] * v[ 2 ] + m[ 14 ] * v[ 3 ] ) * iw,
            1
        ];
    }

    static normalize3( v: Vec3 ): Vec3
    {
        let ilen = 1 / Math.sqrt( v[ 0 ] * v[ 0 ] + v[ 1 ] * v[ 1 ] + v[ 2 ] * v[ 2 ] );
        return [ v[ 0 ] * ilen, v[ 1 ] * ilen, v[ 2 ] * ilen ];
    }

    static setLength3( v: Vec3, length: number ): Vec3
    {
        let ilen = length / Math.sqrt( v[ 0 ] * v[ 0 ] + v[ 1 ] * v[ 1 ] + v[ 2 ] * v[ 2 ] );
        return [ v[ 0 ] * ilen, v[ 1 ] * ilen, v[ 2 ] * ilen ];
    }

    static negate3( v: Vec3 ): Vec3
    {
        return [ -v[ 0 ], -v[ 1 ], -v[ 2 ] ];
    }

    static createIdentity4x4(): Mat4
    {
        return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    }

    static createTranslation4x4( x: number, y: number, z: number ): Mat4
    {
        return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1 ];
    }

    static createScaling4x4( x: number, y: number, z: number ): Mat4
    {
        return [ x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1 ];
    }

    static createRotationX4x4( x: number ): Mat4
    {
        var s = Math.sin( x );
        var c = Math.cos( x );
        return [ 1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1 ];
    }

    static createRotationY4x4( y: number ): Mat4
    {
        var s = Math.sin( y );
        var c = Math.cos( y );
        return [ c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1 ];
    }

    static createRotationZ3x3( z: number ): Mat3
    {
        var s = Math.sin( z );
        var c = Math.cos( z );
        return [ c, s, 0, -s, c, 0, 0, 0, 1 ];
    }

    static createRotationZ4x4( z: number ): Mat4
    {
        var s = Math.sin( z );
        var c = Math.cos( z );
        return [ c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    }

    static createPerspective4x4( fovy: number, aspect: number, near: number, far: number ): Mat4
    {
        let f = 1 / Math.tan( fovy * .5 );
        let nf = 1 / ( near - far );
        return [ f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, ( far + near ) * nf, -1, 0, 0, 2 * far * near * nf, 0 ];
    }

    static createLookAt4x4( position: number[], target: number[], up: number[] ): Mat4
    {
        let px = position[ 0 ];
        let py = position[ 1 ];
        let pz = position[ 2 ];
        let ux = up[ 0 ];
        let uy = up[ 1 ];
        let uz = up[ 2 ];
        let tx = target[ 0 ];
        let ty = target[ 1 ];
        let tz = target[ 2 ];

        let z0 = px - tx;
        let z1 = py - ty;
        let z2 = pz - tz;
        let len = 1 / Math.hypot( z0, z1, z2 );
        z0 *= len;
        z1 *= len;
        z2 *= len;
        let x0 = uy * z2 - uz * z1;
        let x1 = uz * z0 - ux * z2;
        let x2 = ux * z1 - uy * z0;
        len = Math.hypot( x0, x1, x2 );

        if ( !len )
        {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else
        {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        let y0 = z1 * x2 - z2 * x1;
        let y1 = z2 * x0 - z0 * x2;
        let y2 = z0 * x1 - z1 * x0;
        len = Math.hypot( y0, y1, y2 );

        if ( !len )
        {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else
        {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        return [ x0, y0, z0, 0, x1, y1, z1, 0, x2, y2, z2, 0, -( x0 * px + x1 * py + x2 * pz ), -( y0 * px + y1 * py + y2 * pz ), -( z0 * px + z1 * py + z2 * pz ), 1 ];
    }

    static createTransformation4x4( scalingX: number, scalingY: number, scalingZ: number,
        rotationX: number, rotationY: number, rotationZ: number,
        x: number, y: number, z: number ): Mat4
    {
        let a = 1, b = 0, c = 1, d = 0, e = 1, f = 0;
        if ( rotationX )
        {
            a = Math.cos( rotationX );
            b = Math.sin( rotationX );
        }
        if ( rotationY )
        {
            c = Math.cos( rotationY );
            d = Math.sin( rotationY );
        }
        if ( rotationZ )
        {
            e = Math.cos( rotationZ );
            f = Math.sin( rotationZ );
        }
        return [
            scalingX * ( e * c ), scalingY * ( a * f + e * b * d ), scalingZ * ( b * f - e * a * d ), 0,
            scalingX * ( -c * f ), scalingY * ( e * a - b * d * f ), scalingZ * ( a * d * f + e * b ), 0,
            scalingY * d, scalingY * -b * c, scalingZ * c * a, 0, x, y, z, 1
        ];
    }

    static mul4x4v( ...matrices: Mat4[] ): Mat4
    {
        let ret = matrices[ 0 ];
        for ( let i = 1; i < matrices.length; i++ )
            ret = this.mul4x4( ret, matrices[ i ] );
        return ret;
    }

    static mul4x4( a: Mat4, b: Mat4 ): Mat4
    {
        return [
            b[ 0 ] * a[ 0 ] + b[ 1 ] * a[ 4 ] + b[ 2 ] * a[ 8 ] + b[ 3 ] * a[ 12 ],
            b[ 0 ] * a[ 1 ] + b[ 1 ] * a[ 5 ] + b[ 2 ] * a[ 9 ] + b[ 3 ] * a[ 13 ],
            b[ 0 ] * a[ 2 ] + b[ 1 ] * a[ 6 ] + b[ 2 ] * a[ 10 ] + b[ 3 ] * a[ 14 ],
            b[ 0 ] * a[ 3 ] + b[ 1 ] * a[ 7 ] + b[ 2 ] * a[ 11 ] + b[ 3 ] * a[ 15 ],
            b[ 4 ] * a[ 0 ] + b[ 5 ] * a[ 4 ] + b[ 6 ] * a[ 8 ] + b[ 7 ] * a[ 12 ],
            b[ 4 ] * a[ 1 ] + b[ 5 ] * a[ 5 ] + b[ 6 ] * a[ 9 ] + b[ 7 ] * a[ 13 ],
            b[ 4 ] * a[ 2 ] + b[ 5 ] * a[ 6 ] + b[ 6 ] * a[ 10 ] + b[ 7 ] * a[ 14 ],
            b[ 4 ] * a[ 3 ] + b[ 5 ] * a[ 7 ] + b[ 6 ] * a[ 11 ] + b[ 7 ] * a[ 15 ],
            b[ 8 ] * a[ 0 ] + b[ 9 ] * a[ 4 ] + b[ 10 ] * a[ 8 ] + b[ 11 ] * a[ 12 ],
            b[ 8 ] * a[ 1 ] + b[ 9 ] * a[ 5 ] + b[ 10 ] * a[ 9 ] + b[ 11 ] * a[ 13 ],
            b[ 8 ] * a[ 2 ] + b[ 9 ] * a[ 6 ] + b[ 10 ] * a[ 10 ] + b[ 11 ] * a[ 14 ],
            b[ 8 ] * a[ 3 ] + b[ 9 ] * a[ 7 ] + b[ 10 ] * a[ 11 ] + b[ 11 ] * a[ 15 ],
            b[ 12 ] * a[ 0 ] + b[ 13 ] * a[ 4 ] + b[ 14 ] * a[ 8 ] + b[ 15 ] * a[ 12 ],
            b[ 12 ] * a[ 1 ] + b[ 13 ] * a[ 5 ] + b[ 14 ] * a[ 9 ] + b[ 15 ] * a[ 13 ],
            b[ 12 ] * a[ 2 ] + b[ 13 ] * a[ 6 ] + b[ 14 ] * a[ 10 ] + b[ 15 ] * a[ 14 ],
            b[ 12 ] * a[ 3 ] + b[ 13 ] * a[ 7 ] + b[ 14 ] * a[ 11 ] + b[ 15 ] * a[ 15 ]
        ];
    }

    static invert4x4( a: Mat4 ): Mat4
    {
        let a00 = a[ 0 ],
            a01 = a[ 1 ],
            a02 = a[ 2 ],
            a03 = a[ 3 ];
        let a10 = a[ 4 ],
            a11 = a[ 5 ],
            a12 = a[ 6 ],
            a13 = a[ 7 ];
        let a20 = a[ 8 ],
            a21 = a[ 9 ],
            a22 = a[ 10 ],
            a23 = a[ 11 ];
        let a30 = a[ 12 ],
            a31 = a[ 13 ],
            a32 = a[ 14 ],
            a33 = a[ 15 ];
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if ( !det )
            throw new Error( "Cannot invert matrix" );

        det = 1 / det;
        return [
            ( a11 * b11 - a12 * b10 + a13 * b09 ) * det,
            ( a02 * b10 - a01 * b11 - a03 * b09 ) * det,
            ( a31 * b05 - a32 * b04 + a33 * b03 ) * det,
            ( a22 * b04 - a21 * b05 - a23 * b03 ) * det,
            ( a12 * b08 - a10 * b11 - a13 * b07 ) * det,
            ( a00 * b11 - a02 * b08 + a03 * b07 ) * det,
            ( a32 * b02 - a30 * b05 - a33 * b01 ) * det,
            ( a20 * b05 - a22 * b02 + a23 * b01 ) * det,
            ( a10 * b10 - a11 * b08 + a13 * b06 ) * det,
            ( a01 * b08 - a00 * b10 - a03 * b06 ) * det,
            ( a30 * b04 - a31 * b02 + a33 * b00 ) * det,
            ( a21 * b02 - a20 * b04 - a23 * b00 ) * det,
            ( a11 * b07 - a10 * b09 - a12 * b06 ) * det,
            ( a00 * b09 - a01 * b07 + a02 * b06 ) * det,
            ( a31 * b01 - a30 * b03 - a32 * b00 ) * det,
            ( a20 * b03 - a21 * b01 + a22 * b00 ) * det
        ];
    }

    static transpose4x4( a: Mat4 ): Mat4
    {
        return [ a[ 0 ], a[ 4 ], a[ 8 ], a[ 12 ], a[ 1 ], a[ 5 ], a[ 9 ], a[ 13 ], a[ 2 ], a[ 6 ], a[ 10 ], a[ 14 ], a[ 3 ], a[ 7 ], a[ 11 ], a[ 15 ] ];
    }

    static matrix4x4toMatrix3x3( a: Mat4 ): Mat3
    {
        return [ a[ 0 ], a[ 1 ], a[ 2 ], a[ 4 ], a[ 5 ], a[ 6 ], a[ 8 ], a[ 9 ], a[ 10 ] ];
    }


    static createIdentity3x3()
    {
        return [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
    }

    static add3( a: Vec3, b: Vec3 ): Vec3
    {
        return [ a[ 0 ] + b[ 0 ], a[ 1 ] + b[ 1 ], a[ 2 ] + b[ 2 ] ];
    }

    static transform3x3( m: Mat3, v: Vec3 ): Vec3
    {
        return [
            v[ 0 ] * m[ 0 ] + v[ 1 ] * m[ 3 ] + v[ 2 ] * m[ 6 ],
            v[ 0 ] * m[ 1 ] + v[ 1 ] * m[ 4 ] + v[ 2 ] * m[ 7 ],
            v[ 0 ] * m[ 2 ] + v[ 1 ] * m[ 5 ] + v[ 2 ] * m[ 8 ]
        ];
    }

    static mul3x3( a: Mat3, b: Mat3 ): Mat3
    {
        let a00 = a[ 0 ],
            a01 = a[ 1 ],
            a02 = a[ 2 ];
        let a10 = a[ 3 ],
            a11 = a[ 4 ],
            a12 = a[ 5 ];
        let a20 = a[ 6 ],
            a21 = a[ 7 ],
            a22 = a[ 8 ];
        let b00 = b[ 0 ],
            b01 = b[ 1 ],
            b02 = b[ 2 ];
        let b10 = b[ 3 ],
            b11 = b[ 4 ],
            b12 = b[ 5 ];
        let b20 = b[ 6 ],
            b21 = b[ 7 ],
            b22 = b[ 8 ];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22
        ];
    }

    static invert3x3( a: Mat3 ): Mat3
    {
        let a00 = a[ 0 ],
            a01 = a[ 1 ],
            a02 = a[ 2 ];
        let a10 = a[ 3 ],
            a11 = a[ 4 ],
            a12 = a[ 5 ];
        let a20 = a[ 6 ],
            a21 = a[ 7 ],
            a22 = a[ 8 ];
        let b01 = a22 * a11 - a12 * a21;
        let b11 = -a22 * a10 + a12 * a20;
        let b21 = a21 * a10 - a11 * a20;

        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if ( !det )
            throw new Error( "Cannot invert matrix" );

        det = 1.0 / det;
        return [
            b01 * det, ( -a22 * a01 + a02 * a21 ) * det, ( a12 * a01 - a02 * a11 ) * det,
            b11 * det, ( a22 * a00 - a02 * a20 ) * det, ( -a12 * a00 + a02 * a10 ) * det,
            b21 * det, ( -a21 * a00 + a01 * a20 ) * det, ( a11 * a00 - a01 * a10 ) * det
        ];
    }

    static invertInPlace3x3( a: Mat3 ): void
    {
        let a00 = a[ 0 ],
            a01 = a[ 1 ],
            a02 = a[ 2 ];
        let a10 = a[ 3 ],
            a11 = a[ 4 ],
            a12 = a[ 5 ];
        let a20 = a[ 6 ],
            a21 = a[ 7 ],
            a22 = a[ 8 ];
        let b01 = a22 * a11 - a12 * a21;
        let b11 = -a22 * a10 + a12 * a20;
        let b21 = a21 * a10 - a11 * a20;

        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if ( !det )
            throw new Error( "Matrix has no inverse" );

        det = 1.0 / det;
        a[ 0 ] = b01 * det;
        a[ 1 ] = ( -a22 * a01 + a02 * a21 ) * det;
        a[ 2 ] = ( a12 * a01 - a02 * a11 ) * det;
        a[ 3 ] = b11 * det;
        a[ 4 ] = ( a22 * a00 - a02 * a20 ) * det;
        a[ 5 ] = ( -a12 * a00 + a02 * a10 ) * det;
        a[ 6 ] = b21 * det;
        a[ 7 ] = ( -a21 * a00 + a01 * a20 ) * det;
        a[ 8 ] = ( a11 * a00 - a01 * a10 ) * det;
    }

    static transpose3x3( a: Mat3 ): Mat3
    {
        return [ a[ 0 ], a[ 3 ], a[ 6 ], a[ 1 ], a[ 4 ], a[ 7 ], a[ 2 ], a[ 5 ], a[ 8 ] ];
    }

    static transposeInPlace3x3( a: Mat3 ): void
    {
        let a01 = a[ 1 ],
            a02 = a[ 2 ],
            a12 = a[ 5 ];
        a[ 1 ] = a[ 3 ];
        a[ 2 ] = a[ 6 ];
        a[ 3 ] = a01;
        a[ 5 ] = a[ 7 ];
        a[ 6 ] = a02;
        a[ 7 ] = a12;
    }
}